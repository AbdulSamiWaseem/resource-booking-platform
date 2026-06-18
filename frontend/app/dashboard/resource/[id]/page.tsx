"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { Calendar } from "antd";
import dayjs from "dayjs";
import { getApi, postApi, deleteApi } from "../../../services/apiCalls";
import { useForm } from "react-hook-form";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

interface BookingInputs {
  date: string;
  startTime: string;
  endTime: string;
}

export default function ResourceDetailPage() {
  const params = useParams();
  const router = useRouter();
  const resourceId = Number(params.id);
  const queryClient = useQueryClient();

  const [isBookingModalVisible, setIsBookingModalVisible] = useState(false);
  const [userId, setUserId] = useState(null);

  const { register, handleSubmit, formState, reset } = useForm<BookingInputs>();
  const { errors } = formState;

  const bookingMutation = useMutation({
    mutationFn: (payload: any) => postApi("bookings", payload),
    onSuccess: (res: any) => {
      toast.success(res?.message || "Booking created successfully!");
      setIsBookingModalVisible(false);
      reset();
      queryClient.invalidateQueries({ queryKey: ["resource", resourceId] });
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || "Failed to create booking.");
    },
  });

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

    bookingMutation.mutate(payload);
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

  const cancelMutation = useMutation({
    mutationFn: ({ bookingId, payload }: { bookingId: number; payload: any }) =>
      deleteApi(`bookings/${bookingId}`, payload),
    onSuccess: (res: any) => {
      toast.success(res?.message || "Booking cancelled successfully!");
      queryClient.invalidateQueries({ queryKey: ["resource", resourceId] });
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || "Failed to cancel booking.");
    },
  });

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
              <button
                disabled={!isOwner || cancelMutation.isPending}
                onClick={() => cancelBooking(booking.id)}
                className={`p-1 rounded text-white ${isOwner && !cancelMutation.isPending
                  ? "bg-red-500 hover:bg-red-600 cursor-pointer"
                  : "bg-red-500 cursor-not-allowed opacity-50"
                  }`}
              >
                Cancel
              </button>
            </div>
          );
        })
        }
      </div >
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
          <button
            onClick={() => setIsBookingModalVisible(true)}
            className="text-sm bg-blue-500 text-white px-4 py-2 rounded cursor-pointer">
            Create Booking
          </button>
          <button
            onClick={() => router.push("/dashboard")}
            className="text-sm bg-gray-200 px-4 py-2 rounded cursor-pointer"
          >
            Back to Dashboard
          </button>
        </div>
      </div>

      <div className="border border-gray-200 rounded-lg p-4 mt-6">
        <div className="text-lg font-semibold mb-4">Resource Booking Schedule</div>
        <Calendar cellRender={cellRender} />
      </div>

      {isBookingModalVisible && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-lg w-full mx-4">
            <h3 className="text-lg font-bold mb-4">Create Booking</h3>
            <form onSubmit={handleSubmit(handleBookingSubmit)} noValidate className="space-y-4">
              <div>
                <div className="text-sm font-semibold" >Date</div>
                <input
                  type="date"
                  {...register("date", { required: "Date is required" })}
                  className="w-full p-2 border border-gray-300 rounded"
                />
                {errors.date && (
                  <p className="text-red-500 text-xs mt-1">{errors.date.message}</p>
                )}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm font-semibold" >Start Time</div>
                  <input
                    type="time"
                    {...register("startTime", { required: "Start time is required" })}
                    className="w-full p-2 border border-gray-300 rounded"
                  />
                  {errors.startTime && (
                    <p className="text-red-500 text-xs mt-1">{errors.startTime.message}</p>
                  )}
                </div>
                <div>
                  <div className="text-sm font-semibold" >End Time</div>
                  <input
                    type="time"
                    {...register("endTime", { required: "End time is required" })}
                    className="w-full p-2 border border-gray-300 rounded"
                  />
                  {errors.endTime && (
                    <p className="text-red-500 text-xs mt-1">{errors.endTime.message}</p>
                  )}
                </div>
              </div>
              <div className="flex gap-3 justify-end pt-4">
                <button
                  type="button"
                  onClick={() => setIsBookingModalVisible(false)}
                  className="px-4 py-2 bg-gray-200 rounded text-sm cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={bookingMutation.isPending}
                  className="px-4 py-2 bg-blue-500 text-white rounded text-sm cursor-pointer"
                >
                  {bookingMutation.isPending ? "Booking..." : "Book Resource"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

