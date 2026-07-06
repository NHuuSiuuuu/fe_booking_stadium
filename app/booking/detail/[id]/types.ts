export type BookingStatus = "pending" | "confirmed" | "cancelled";


export type BookingData = {
  stadiumBooking: {
    thumbnail: string;
    name: string;
    type: number;
    address: string;
    start_time: string;
    end_time: string;
    day_of_week: string;
  };

  result: {
    payment_method: string;
    total_price: number;
    booking_date: string;
    status: BookingStatus;
    full_name: string;
    email: string;
    phone: string;
    note?: string;
    id: string;
    payment_status: string;
    stadium_id: number;
  };
};