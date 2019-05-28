export default class Log {
  public static isEnabled: boolean = true;
  public static log(message: string) {
    if (Log.isEnabled) {
      console.log(message);
    }
  }

  public static error(message: string) {
    if (Log.isEnabled) {
      console.error(message);
    }
  }
}
