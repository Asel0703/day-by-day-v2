export type Task = { id: string; owner_id: string; title: string; done: boolean; day: string; room_id: string | null; created_at: string };
export type Room = { id: string; name: string; code: string };

export const MOODS = [
  { key: "great", emoji: "🤩", label: "Тамаша" },
  { key: "good", emoji: "😊", label: "Жақсы" },
  { key: "ok", emoji: "😐", label: "Қалыпты" },
  { key: "bad", emoji: "😔", label: "Нашар" },
] as const;

export const MONTHS = ["Қаңтар","Ақпан","Наурыз","Сәуір","Мамыр","Маусым","Шілде","Тамыз","Қыркүйек","Қазан","Қараша","Желтоқсан"];
export const WEEKDAYS = ["Дс", "Сс", "Ср", "Бс", "Жм", "Сн", "Жк"];

export const iso = (d: Date) => d.toLocaleDateString("sv-SE");
export const today = () => iso(new Date());
export const addDays = (s: string, n: number) => {
  const d = new Date(s + "T00:00:00");
  d.setDate(d.getDate() + n);
  return iso(d);
};
export const prettyDay = (s: string) => {
  const d = new Date(s + "T00:00:00");
  return `${d.getDate()} ${MONTHS[d.getMonth()].toLowerCase()}`;
};
