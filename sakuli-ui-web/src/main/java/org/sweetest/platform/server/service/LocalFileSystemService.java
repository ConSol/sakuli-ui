package org.sweetest.platform.server.service;

import org.apache.commons.io.FileUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Service;
import org.sweetest.platform.server.api.file.FileSystemService;

import java.io.*;
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

    private static final Logger log = LoggerFactory.getLogger(LocalFileSystemService.class);

    private String rootDirectory;

    @Autowired
    LocalFileSystemService(@Qualifier("rootDirectory") String rootDirectory) {
        this.rootDirectory = rootDirectory;
    }

    public Path normalizePath(String path) {
        //TODO throw error if path is absolute or outside of the root directory
        final Path p = Paths.get(path);
        if (p.isAbsolute()){
            return p.toAbsolutePath().normalize();
        }
        return Paths.get(getRootDirectory(), path).normalize();
    }

    @Override
    public Stream<File> getFiles(String path) {
        File file = normalizePath(path).toFile();
        return !file.exists() ? Stream.empty() : Arrays.stream(Optional.ofNullable(file.list()).orElse(new String[] {}))
                .map(cp -> new File(file, cp));
    }

    @Override
    public Optional<File> getFileFromPath(String path, String file) {
        File f = Paths.get(normalizePath(path).toString(), file).toFile();
        log.info(f.getAbsolutePath() + "!!!!!!!!!!" +f.exists());
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
    public boolean deleteFile(String path) {
        File file = normalizePath(path).toFile();
        return file.exists() && file.isFile() && file.delete();
    }

    @Override
    public boolean fileExists(String path) {
        return normalizePath(path).toFile().exists();
    }

    @Override
    public boolean writeFile(String path, byte[] bytes) {
        try {
            FileUtils.writeByteArrayToFile(
                    normalizePath(path).toFile(), bytes
            );
            return true;
        } catch (IOException e) {
            e.printStackTrace();
            return false;
        }
    }

    @Override
    public Optional<Resource> readFile(String path) {
        try {
            Path nPath = normalizePath(path);
            Resource resource = new UrlResource(nPath.toUri());
            return (resource.isReadable() || resource.exists()) ? Optional.of(resource) : Optional.empty();
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
