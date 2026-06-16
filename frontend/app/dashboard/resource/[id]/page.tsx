"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { Calendar } from "antd";
import dayjs from "dayjs";
import { getRequest, postRequest, deleteRequest } from "../../../services/apiCalls";

export default function ResourceDetailPage() {
  const params = useParams();
  const router = useRouter();
  const resourceId = Number(params.id);

  const [resource, setResource] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isBookingModalVisible, setIsBookingModalVisible] = useState(false);
  const [bookingDate, setBookingDate] = useState("");
  const [bookingStartTime, setBookingStartTime] = useState("");
  const [bookingEndTime, setBookingEndTime] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [userId, setUserId] = useState(null);

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const start = dayjs(`${bookingDate} ${bookingStartTime}`);
    const end = dayjs(`${bookingDate} ${bookingEndTime}`);

    if (!end.isAfter(start)) {
      toast.error("Start time must be before end time.");
      return;
    }
    setSubmitting(true);

    const payload = {
      resourceId,
      userId,
      startTime: start.toISOString(),
      endTime: end.toISOString(),
    };

    const onSuccess = (res: any) => {
      toast.success("Booking created successfully!");
      setIsBookingModalVisible(false);
      setBookingDate("");
      setBookingStartTime("");
      setBookingEndTime("");
      fetchResourceDetails();
      setSubmitting(false);
    };

    const onError = (err: any) => {
      toast.error(err?.message || "Failed to create booking.");
      setSubmitting(false);
    };

    await postRequest(payload, 'bookings', onSuccess, onError);
  };

  const fetchResourceDetails = async () => {
    setLoading(true);
    const onSuccess = (res: any) => {
      const resource = res?.data?.resource;
      if (resource) {
        setResource(resource);
      } else {
        toast.error("Resource not found");
        router.push("/dashboard");
      }
      setLoading(false);
    };

    const onError = (err: any) => {
      toast.error(err?.message || "Failed to load resource details.");
      setLoading(false);
    };

    await getRequest(`resources/${resourceId}`, onSuccess, onError);
  };


  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const parsedUser = JSON.parse(storedUser || "{}");
    if (parsedUser.user?.id) {
      setUserId(parsedUser.user.id);
    }
    if (resourceId) {
      fetchResourceDetails();
    }
  }, [resourceId]);

  const cancelBooking = async (bookingId: number) => {
    if (!window.confirm("Are you sure you want to cancel this booking?")) {
      return;
    }
    if (!userId) {
      toast.error("User not found. Please log in again.");
      return;
    }
    const payload = { userId };
    const onSuccess = (res: any) => {
      toast.success("Booking cancelled successfully!");
      fetchResourceDetails();
    };
    const onError = (err: any) => {
      toast.error(err?.message || "Failed to cancel booking.");
    };
    await deleteRequest(payload, `bookings/${bookingId}`, onSuccess, onError);
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
                disabled={!isOwner}
                onClick={() => cancelBooking(booking.id)}
                className={`p-1 rounded text-white ${isOwner
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
          <h1 className="text-2xl font-bold">{resource.name}</h1>
          <p className="text-sm text-gray-500 mt-1">{resource.description}</p>
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
            <form onSubmit={handleBookingSubmit} className="space-y-4">
              <div>
                <div className="text-sm font-semibold" >Date</div>
                <input
                  type="date"
                  value={bookingDate}
                  onChange={(e) => setBookingDate(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm font-semibold" >Start Time</div>
                  <input
                    type="time"
                    value={bookingStartTime}
                    onChange={(e) => setBookingStartTime(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded"
                    required
                  />
                </div>
                <div>
                  <div className="text-sm font-semibold" >End Time</div>
                  <input
                    type="time"
                    value={bookingEndTime}
                    onChange={(e) => setBookingEndTime(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded"
                    required
                  />
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
                  disabled={submitting}
                  className="px-4 py-2 bg-blue-500 text-white rounded text-sm cursor-pointer"
                >
                  {submitting ? "Booking..." : "Book Resource"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

