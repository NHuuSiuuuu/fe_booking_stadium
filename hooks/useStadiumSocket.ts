// "use client";

// import { useEffect, useState } from "react";
// import { io } from "socket.io-client";

// export default function useStadiumSocket(stadiumId: number) {
//   const [socketId, setSocketId] = useState<number | null>(null);

//   // holdSlots chỉ chứa slot của người khác
//   const [holdSlots, setHoldSlots] = useState<number[]>([]);
//   useEffect(() => {
//     const socket = io("http://localhost:3636");

//     socket.on("connect", () => {
        
//       setSocketId(Number(socket.id));
//       socket.emit("join-stadium", stadiumId);

//       socket.on("sold-held", (data) => {
//         console.log("Khóa các slot", data);
//         setHoldSlots((prev) => [...prev, Number(data.price_config_id)]);
//       });

//       socket.on("sold-released", (data) => {
//         console.log("Mở khóa cho slot:", data);
//         setHoldSlots((prev) => prev.filter((id) => id != data.price_config_id));
//       });
//     });

//     return () => {
//       console.log("cleanup");

//       socket.emit("leave-stadium", stadiumId);
//       socket.off("slot-held");
//       socket.off("sold-released");
//       socket.disconnect();
//     };
//   }, [stadiumId]);
//   return { holdSlots, socketId, setHoldSlots };
// }
