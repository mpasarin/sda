export default class Log {
  public static isEnabled: boolean = true;
  public static isVerbose: boolean = false;

  public static log(message: string) {
    if (Log.isEnabled) {
      console.log(message);
    }
  }

  public static verbose(message: string) {
    if (Log.isEnabled && Log.isVerbose) {
      console.log(message);
    }
  }

  public static error(message: string) {
    if (Log.isEnabled) {
      console.error(message);
    }
  }
}
