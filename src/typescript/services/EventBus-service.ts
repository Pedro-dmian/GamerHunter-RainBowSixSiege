

export interface Subscriptions {
  [key: string]: {
    topics: string[]|string,
    events: string[]|string,
    callback: (topic: string, event: string, data: any) => void
  }
};

export class EventBus {

  public static readonly WILDCARD: string = '*';
  private readonly subscriptions: Subscriptions = {};

  private constructor() {
  }

  static get instance() {
    return ''

    // if (!(<any>overwolf.windows.getMainWindow())) {
    //   (<any>overwolf.windows.getMainWindow()).pubgistics_eventBus = new EventBus;
    // }
    // return (<any>overwolf.windows.getMainWindow()).pubgistics_eventBus;
  }

  public subscribe(key: string, topics: string[]|string, events: string[]|string, callback: (topic: string, event: string, data: any) => void): void {
    this.subscriptions[key] = {
      topics: topics,
      events: events,
      callback: callback
    };
  }
}
