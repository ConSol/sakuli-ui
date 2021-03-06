package org.sweetest.platform.server.api.file;

import org.springframework.core.io.Resource;

import java.io.File;
import java.nio.charset.Charset;
import java.nio.file.Paths;
import java.util.Optional;
import java.util.function.Function;
import java.util.function.Predicate;
import java.util.stream.Stream;

/**
 * Created by timkeiner on 19.07.17.
 */
public interface FileSystemService {

    final static Charset Charset = java.nio.charset.Charset.forName("UTF-8");

    final static Predicate<File> hiddenFiles = f -> !f.isHidden();
    final static Function<String, Function<File, FileModel>> toFileModel = basePath -> f -> new FileModel(
            // Necessary to send paths in URL complient format from the client to server.
            // Java Path class will normalize this on the way back.
            Paths.get(basePath).toString().replace("\\","/"),
            f.getName(),
            f.isDirectory()
    );


    Stream<File> getFiles(String path);
    Optional<File> getFileFromPath(String path, String file);

    Optional<Stream<String>> getFileLines(String path);

    boolean deleteFile(String path);
    boolean writeFile(String path, byte[] content);
    Optional<Resource> readFile(String path);

    boolean fileExists(String path);
}
