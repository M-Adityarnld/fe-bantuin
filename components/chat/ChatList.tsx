// "use client";

// import { useChat } from "@/contexts/ChatContext";
// import { useAuth } from "@/contexts/AuthContext";
// import { ScrollArea } from "@/components/ui/scroll-area";
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// import { formatDistanceToNow } from "date-fns";
// import { id } from "date-fns/locale";

// export const ChatList = () => {
//   const { conversations, setActiveConversation } = useChat();
//   const { user } = useAuth();

//   if (conversations.length === 0) {
//     return (
//       <div className="flex flex-col items-center justify-center h-full text-muted-foreground p-6 text-center">
//         <p>Belum ada percakapan.</p>
//         <p className="text-sm">Mulai chat dari halaman jasa.</p>
//       </div>
//     );
//   }

//   return (
//     <ScrollArea className="h-full">
//       <div className="divide-y">
//         {conversations.map((conv) => {
//           // Cari participant yang bukan user yang sedang login
//           const otherParticipant = conv.participants.find(
//             (p) => p.user.id !== user?.id
//           )?.user;

//           if (!otherParticipant) return null;

//           return (
//             <div
//               key={conv.id}
//               className="p-4 hover:bg-gray-50 cursor-pointer transition-colors flex gap-3 items-start"
//               onClick={() => setActiveConversation(conv)}
//             >
//               <Avatar>
//                 <AvatarImage src={otherParticipant.profilePicture || ""} />
//                 <AvatarFallback>{otherParticipant.fullName[0]}</AvatarFallback>
//               </Avatar>
//               <div className="flex-1 overflow-hidden">
//                 <div className="flex justify-between items-start mb-1">
//                   <h4 className="font-semibold text-sm truncate">
//                     {otherParticipant.fullName}
//                   </h4>
//                   {conv.lastMessage && (
//                     <span className="text-[10px] text-muted-foreground shrink-0">
//                       {formatDistanceToNow(
//                         new Date(conv.lastMessage.createdAt),
//                         { addSuffix: false, locale: id }
//                       )}
//                     </span>
//                   )}
//                 </div>
//                 <p className="text-xs text-muted-foreground truncate">
//                   {conv.lastMessage?.content || "Mulai percakapan..."}
//                 </p>
//               </div>
//             </div>
//           );
//         })}
//       </div>
//     </ScrollArea>
//   );
// };
