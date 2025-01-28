import java.io.*;
import java.net.*;
import javax.crypto.Cipher;
import javax.crypto.SecretKey;
import javax.crypto.spec.SecretKeySpec;
import java.util.Base64;

public class DataUser {
    private static SecretKey aesKey;

    public static void main(String[] args) throws Exception {
        // Initialize AES key (same as Data Owner and Server)
        aesKey = new SecretKeySpec(Base64.getDecoder().decode("PrYRCY2QKDEHsRTTMdFeig=="), "AES");

        // Simulate searching for a keyword
        String searchKeyword = "secret1";
        String encryptedSearchKeyword = encrypt(searchKeyword);

        // Send encrypted search keyword to server
        Socket socket = new Socket("localhost", 12345);
        PrintWriter out = new PrintWriter(socket.getOutputStream(), true);
        out.println("Datauser");
        out.println(encryptedSearchKeyword);

        BufferedReader in = new BufferedReader(new InputStreamReader(socket.getInputStream()));
        String response = in.readLine();
        System.out.println("Server Response: " + response);
        String decryptedData = decrypt(response);
        System.out.println("Decrypted retrieved data:" + decryptedData);

        socket.close();
    }

    private static String encrypt(String plainText) throws Exception {
        Cipher cipher = Cipher.getInstance("AES");
        cipher.init(Cipher.ENCRYPT_MODE, aesKey);
        byte[] encryptedBytes = cipher.doFinal(plainText.getBytes());
        return Base64.getEncoder().encodeToString(encryptedBytes);
    }

    private static String decrypt(String encryptedText) throws Exception {
        Cipher cipher = Cipher.getInstance("AES");
        cipher.init(Cipher.DECRYPT_MODE,aesKey);
        byte[] decryptedBytes = cipher.doFinal(Base64.getDecoder().decode(encryptedText));
        return new String(decryptedBytes);
    }
}
