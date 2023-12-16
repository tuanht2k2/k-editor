package com.kma.wordprocessor.services;

import com.google.auth.oauth2.GoogleCredentials;
import com.google.cloud.storage.StorageOptions;
import org.springframework.beans.factory.annotation.Value;

import com.google.cloud.storage.*;
import org.springframework.stereotype.Service;

import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.net.URL;
import java.util.concurrent.TimeUnit;

@Service
public class FirebaseStorageService {
    @Value("${firebase.storage.bucketName}")
    private String bucketName;

    public URL uploadFile(InputStream fileStream, String folderName ,String fileName) {
        try {
            Storage storage = StorageOptions.newBuilder()
                    .setCredentials(GoogleCredentials.fromStream(new FileInputStream("C:\\KMA\\TTCS\\word-processor\\server\\word-processor\\src\\main\\java\\com\\kma\\wordprocessor\\assets\\serviceAccountKey.json")))
                    .build()
                    .getService();

            BlobId blobId = BlobId.of(bucketName, fileName);
            BlobInfo blobInfo = BlobInfo.newBuilder(blobId).build();
            Blob blob = storage.create(blobInfo, fileStream);
            return blob.signUrl(1000, TimeUnit.DAYS);
        } catch (IOException e) {
            e.printStackTrace();
            // Handle exception
            return null;
        }
    }

}
