import { Observable } from "rxjs";
type ObserverFun = (data: any) => void;
export class Emiter<Topic extends string | number | symbol> {
  private observers: Map<Topic, Function[]> = new Map();
  constructor() {}
  private addObserFun(topic: Topic, fun: ObserverFun) {
    if (!this.observers.has(topic)) {
      this.observers.set(topic, []);
    }
    this.observers.get(topic)!.push(fun);
  }
  on(topic: Topic | Topic[]): Observable<any> {
    return new Observable<any>((observer) => {
      if (Array.isArray(topic)) {
        topic.forEach((top) => {
          this.addObserFun(top, (data) => {
            observer.next(data);
          });
        });
      } else {
        this.addObserFun(topic, (data) => {
          observer.next(data);
        });
      }
    });
  }
  emit(topic: Topic, data?: any) {
    this.observers.get(topic)?.forEach((fun) => {
      fun(data);
    });
  }
}
enum Topics {
  A,
  B,
  C,
}
const emiter = new Emiter<Topics>();
emiter.on(Topics.A).subscribe((data) => {
  console.log(data);
});
emiter.emit(Topics.A, "hahaha");
setTimeout(() => {
  emiter.emit(Topics.A, "1 s later hahaha");
}, 1000);
export default Emiter;
