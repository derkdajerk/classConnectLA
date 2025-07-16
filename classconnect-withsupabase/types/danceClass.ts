export interface DanceClass {
  class_id: string;
  classname: string;
  instructor: string;
  price: number;
  time: string;
  length: string;
  studio_name: string;
  date: string;
}

// For creating new dance classes where some fields might be optional
export interface NewDanceClass extends Omit<DanceClass, "class_id" | "date"> {
  class_id?: string;
  date?: string;
}
