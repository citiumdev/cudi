import type { User } from "@/types/user";
import type { Event } from "@/types/event";
import EditEventForm from "./EditEventForm";
import EventParticipants from "./EventParticipants";

interface Props {
  event: Event;
  presenters: User[];
  presentersOptions: User[];
}

export default function EventDetails({
  event,
  presenters,
  presentersOptions,
}: Props) {
  return (
    <div className="container mx-auto flex max-w-6xl flex-col">
      <EditEventForm
        event={event}
        presenters={presenters}
        presentersOptions={presentersOptions}
      />
      <div className="grid w-full grid-cols-1">
        <EventParticipants event={event} />
      </div>
    </div>
  );
}
