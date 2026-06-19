"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { Calendar } from "antd";
import dayjs from "dayjs";
import { getApi } from "../../../services/apiCalls";
import { useForm } from "react-hook-form";
import { useQuery } from "@tanstack/react-query";
import { createBooking, deleteBooking } from "../../../services/mutation";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Card,
  CardHeader,
  CardContent,
  TextField,
  Button,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";

const schema = z.object({
  date: z.string().min(1, "Date is required"),
  startTime: z.string().min(1, "Start time is required"),
  endTime: z.string().min(1, "End time is required"),
});

interface BookingInputs {
  date: string;
  startTime: string;
  endTime: string;
}

export default function ResourceDetailPage() {
  const params = useParams();
  const router = useRouter();
  const resourceId = Number(params.id);

  const [isBookingModalVisible, setIsBookingModalVisible] = useState(false);
  const [userId, setUserId] = useState(null);

  const { register, handleSubmit, formState, reset } = useForm<BookingInputs>({
    resolver: zodResolver(schema)
  });
  const { errors } = formState;

  const bookingMutation = createBooking(resourceId);

  const handleBookingSubmit = async (data: BookingInputs) => {
    const start = dayjs(`${data.date} ${data.startTime}`);
    const end = dayjs(`${data.date} ${data.endTime}`);

    if (!end.isAfter(start)) {
      toast.error("Start time must be before end time.");
      return;
    }

    const payload = {
      resourceId,
      userId,
      startTime: start.toISOString(),
      endTime: end.toISOString(),
    };

    bookingMutation.mutate(payload, {
      onSuccess: () => {
        setIsBookingModalVisible(false);
        reset();
      },
    });
  };

  const { data: resourceData, isLoading: loading } = useQuery({
    queryKey: ["resource", resourceId],
    queryFn: () => getApi(`resources/${resourceId}`),
  });
  const resource = resourceData?.resource;

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const parsedUser = JSON.parse(storedUser || "{}");
    if (parsedUser.user?.id) {
      setUserId(parsedUser.user.id);
    }
  }, []);

  const cancelMutation = deleteBooking(resourceId);

  const cancelBooking = async (bookingId: number) => {
    if (!window.confirm("Are you sure you want to cancel this booking?")) {
      return;
    }
    if (!userId) {
      toast.error("User not found. Please log in again.");
      return;
    }
    const payload = { userId };
    cancelMutation.mutate({ bookingId, payload });
  };
  const dateCellRender = (value: any) => {
    if (!resource?.bookings) return null;

    const bookings = resource.bookings.filter((booking: any) =>
      dayjs(booking.startTime).isSame(value, "day")
    );

    return (
      <div>
        {bookings.map((booking: any) => {
          const startTime = dayjs(booking.startTime).format("hh:mm A");
          const endTime = dayjs(booking.endTime).format("hh:mm A");
          const isOwner = booking.userId === userId;
          return (
            <div key={booking.id} className="flex justify-between items-center text-[10px] mb-1 border border-gray-200 rounded px-1 py-0.5">
              <div>
                <div className="font-semibold text-nowrap">{startTime} - {endTime}</div>
                <div className="text-gray-500">By: {booking.user.name}</div>
              </div>
              <Button
                disabled={!isOwner || cancelMutation.isPending}
                onClick={() => {
                  cancelBooking(booking.id);
                }}
                variant="contained"
                size="small"
                color="error"
                sx={{
                  minWidth: "auto",
                  fontSize: "10px",
                  textTransform: "none"
                }}
              >
                Cancel
              </Button>
            </div>
          );
        })}
      </div>
    );
  };

  const cellRender = (current: any, info: any) => {
    if (info.type === "date") return dateCellRender(current);
    return info.originNode;
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="text-gray-500 font-medium">Loading...</div>
      </div>
    );
  }
  return (
    <div className="p-6">
      <div className="flex justify-between items-start pb-4 border-b border-gray-200">
        <div className="flex flex-col">
          <h1 className="text-2xl font-bold">{resource?.name}</h1>
          <p className="text-sm text-gray-500 mt-1">{resource?.description}</p>
        </div>
        <div className="flex gap-4 min-w-80 mt-1">
          <Button
            onClick={() => setIsBookingModalVisible(true)}
            variant="contained"
            sx={{ textTransform: "none" }}
          >
            Create Booking
          </Button>
          <Button
            onClick={() => router.push("/dashboard")}
            variant="outlined"
            sx={{ textTransform: "none" }}
          >
            Back to Dashboard
          </Button>
        </div>
      </div>

      <Card variant="outlined" className="mt-6">
        <CardContent>
          <div className="text-lg font-semibold">Resource Booking Schedule</div>
          <Calendar cellRender={cellRender} />
        </CardContent>
      </Card>

      <Dialog
        open={isBookingModalVisible}
        onClose={() => setIsBookingModalVisible(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Create Booking</DialogTitle>
        <DialogContent dividers>
          <form id="create-booking" onSubmit={handleSubmit(handleBookingSubmit)} noValidate>
            <Stack spacing={2}>
              <div>
                <div className="text-sm font-semibold mb-1">Date</div>
                <TextField
                  type="date"
                  fullWidth
                  {...register("date")}
                  error={!!errors.date}
                  helperText={errors.date?.message}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm font-semibold mb-1">Start Time</div>
                  <TextField
                    type="time"
                    fullWidth
                    {...register("startTime")}
                    error={!!errors.startTime}
                    helperText={errors.startTime?.message}
                  />
                </div>
                <div>
                  <div className="text-sm font-semibold mb-1">End Time</div>
                  <TextField
                    type="time"
                    fullWidth
                    {...register("endTime")}
                    error={!!errors.endTime}
                    helperText={errors.endTime?.message}
                  />
                </div>
              </div>
            </Stack>
          </form>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button
            onClick={() => setIsBookingModalVisible(false)}
            variant="contained"
            color="error"
            sx={{ textTransform: "none" }}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            form="create-booking"
            variant="contained"
            disabled={bookingMutation.isPending}
            sx={{ textTransform: "none" }}
          >
            {bookingMutation.isPending ? "Booking..." : "Book Resource"}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
