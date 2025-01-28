import javax.crypto.Cipher;
import javax.crypto.KeyGenerator;
import javax.crypto.SecretKey;
import javax.crypto.spec.SecretKeySpec;
import java.io.*;
import java.net.*;
import java.util.Base64;

public class DataOwner {
    private static SecretKey aesKey;

    public static void main(String[] args) throws Exception {
        // Generate AES Key
        aesKey = new SecretKeySpec(Base64.getDecoder().decode("PrYRCY2QKDEHsRTTMdFeig=="), "AES");
        System.out.println(aesKey);

        // Data to be uploaded
        String keyword = "secret1";
        String data = "Sensitive Data Message 1";

        // Encrypt data and keyword
        String encryptedKeyword = encrypt(keyword);
        String encryptedData = encrypt(data);

        // Simulate uploading encrypted data and keyword to the server
        Socket socket = new Socket("localhost", 12345);
        PrintWriter out = new PrintWriter(socket.getOutputStream(), true);
        out.println("Dataowner");
        out.println(encryptedKeyword);  // Send encrypted keyword
        out.println(encryptedData);     // Send encrypted data

        socket.close();
    }

    private static String encrypt(String plainText) throws Exception {
        Cipher cipher = Cipher.getInstance("AES");
        cipher.init(Cipher.ENCRYPT_MODE, aesKey);
        byte[] encryptedBytes = cipher.doFinal(plainText.getBytes());
        return Base64.getEncoder().encodeToString(encryptedBytes);
    }
}
