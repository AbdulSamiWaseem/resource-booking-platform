"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { Calendar } from "antd";
import dayjs from "dayjs";
import { getRequest } from "../../../services/apiCalls";

export default function ResourceDetailPage() {
  const params = useParams();
  const router = useRouter();
  const resourceId = Number(params.id);

  const [resource, setResource] = useState<any>(null);
  const [loading, setLoading] = useState(true);

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
    if (resourceId) {
      fetchResourceDetails();
    }
  }, [resourceId]);

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
          return (
            <div key={booking.id} className="text-xs mb-1 border border-gray-200 rounded px-1 py-0.5">
              <div className="font-semibold">{startTime} - {endTime}</div>
              <div className="text-xs text-gray-500">By: {booking.user.name}</div>
            </div>
          );
        })}
      </div>
    );
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
      <div className="flex justify-between items-center pb-4 border-b border-gray-200">
        <div>
          <h1 className="text-2xl font-bold">{resource.name}</h1>
          <p className="text-sm text-gray-500 mt-1">{resource.description}</p>
        </div>
        <button
          onClick={() => router.push("/dashboard")}
          className="text-sm bg-gray-200 px-4 py-2 rounded cursor-pointer"
        >
          Back to Dashboard
        </button>
      </div>

      <div className="border border-gray-200 rounded-lg p-4 mt-6">
        <div className="text-lg font-semibold mb-4">Resource Booking Schedule</div>
        <Calendar dateCellRender={dateCellRender} />
      </div>
    </div>
  );
}

