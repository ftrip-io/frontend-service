import { type FC } from "react";
import { SelectOptionField } from "../../core/components/SelectOptionField";

const seenOptions = [
  { label: "Unread", value: false },
  { label: "Read", value: true },
  { label: "All", value: "All" },
];

type NotificationsFilterProps = {
  seen: string;
  onSeenChange: (seen: string) => any;
};

export const NotificationsFilter: FC<NotificationsFilterProps> = ({ seen, onSeenChange }) => {
  return (
    <form>
      <SelectOptionField label="" value={seen} options={seenOptions} onChange={onSeenChange} />
    </form>
  );
};
