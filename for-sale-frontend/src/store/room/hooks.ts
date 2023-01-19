import { useAppSelector } from '../../hooks/redux';

export function useRoomState() {
  return useAppSelector((state) => state.room);
}
