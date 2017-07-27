package org.sweetest.platform.server.service;

import org.apache.commons.codec.binary.Base64;
import org.apache.commons.io.FileUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Service;
import org.sweetest.platform.server.api.file.FileSystemService;
import org.sweetest.platform.server.api.file.MimeTypeMap;

import java.io.*;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Arrays;
import java.util.Optional;
import java.util.stream.Stream;

/**
 * Created by timkeiner on 19.07.17.
 */
@Service
public class LocalFileSystemService implements FileSystemService {

    private String rootDirectory;

    @Autowired
    LocalFileSystemService(@Qualifier("rootDirectory") String rootDirectory) {
        this.rootDirectory = rootDirectory;
    }

    public Path normalizePath(String path) {
        if(path.startsWith("/")) {
            return Paths.get(path);
        } else {
            return Paths.get(getRootDirectory(), path);
        }
    }

    @Override
    public Stream<File> getFiles(String path) {
        File file = normalizePath(path).toFile();
        return !file.exists() ? Stream.empty() : Arrays.asList(file.list())
                .stream()
                .map(cp -> new File(file, cp));
    }

    @Override
    public Optional<File> getFileFromPath(String path, String file) {
        File f = Paths.get(normalizePath(path).toString(), file).toFile();
        if(f.exists()) {
            return Optional.of(f);
        } else {
            return Optional.empty();
        }
    }

    @Override
    public Optional<Stream<String>> getFileLines(String path) {
        File file = normalizePath(path).toFile();
        try {
            FileReader fileReader = new FileReader(file);
            return Optional.of(new BufferedReader(fileReader).lines());
        } catch (FileNotFoundException e) {
            return Optional.empty();
        }
    }

    @Override
    public boolean writeFile(String path, String content) {
        try {
            FileUtils.writeStringToFile(normalizePath(path).toFile(), content, FileSystemService.Charset);
            return true;
        } catch (IOException e) {
            e.printStackTrace();
            return false;
        }
    }

    @Override
    public Optional<String> readFile(String path) {
        try {
            File file = normalizePath(path).toFile();
            MimeTypeMap mimeTypeMap = MimeTypeMap.getInstance();
            String type = mimeTypeMap.getMimeFor(file).orElse("application/octet-stream");
            if(mimeTypeMap.isText(type)) {
                return Optional.of(FileUtils.readFileToString(file, FileSystemService.Charset));
            } else {
                byte[] encodedFile = Base64.encodeBase64(Files.readAllBytes(file.toPath()));
                return Optional.of("data:" + type + ";base64," + new String(encodedFile, FileSystemService.Charset));
            }
        } catch (IOException e) {
            e.printStackTrace();
            return Optional.empty();
        }
    }

    public String getRootDirectory() {
        return rootDirectory;
    }

    public void setRootDirectory(String rootDirectory) {
        this.rootDirectory = rootDirectory;
    }
}
