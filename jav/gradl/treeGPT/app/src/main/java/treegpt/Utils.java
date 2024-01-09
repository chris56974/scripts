package treegpt;

public class Utils {

  public enum OS {
    MAC, WINDOWS, LINUX
  }

  private static OS os = null;

  public static boolean checkIfMacOS() {
    return os == OS.MAC;
  }

  public OS getOS() {
    if (os == null) {
      String osName = System.getProperty("os.name").toLowerCase();

      if (osName.contains("win")) {
        os = OS.WINDOWS;
      }

    }

    return os;
  }
}
