package org.sweetest.platform.server.api.file;

import org.apache.commons.io.FileUtils;
import org.apache.commons.lang.builder.ReflectionToStringBuilder;

import java.io.File;
import java.io.IOException;
import java.net.URISyntaxException;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Optional;

public class MimeTypeMap extends HashMap<String, List<String>> {

    private static MimeTypeMap instance = null;
    private List<String> textMimes = Arrays.asList(
            "application/x-javascript",
            "application/json");

    public static MimeTypeMap getInstance() {
        if (null == instance) {
            instance = new MimeTypeMap();
        }
        return instance;
    }

    private MimeTypeMap() {
        try {
            File mimeFile = null;
            mimeFile = new File(getClass().getResource("mime.types").toURI());

            FileUtils.readLines(mimeFile, FileSystemService.Charset).stream()
                    .map(s -> s.split(" "))
                    .filter(s -> s.length > 1)
                    .forEach(s -> put(s[0], Arrays.asList(Arrays.copyOfRange(s, 1, s.length))));
        } catch (IOException | URISyntaxException e) {
            e.printStackTrace();
        }
    }

    public boolean isText(String mime) {
        return mime.startsWith("text") || textMimes.contains(mime);
    }

    public Optional<String> getMimeForPath(String path) {
        String[] parts = path.split("\\.");
        if(parts.length > 0) {
            String ext = parts[parts.length - 1];
            return getMimeFor(ext);
        } else {
            return Optional.empty();
        }
    }

    public Optional<String> getMimeFor(String ext) {
        return this.entrySet().stream()
                .filter(es -> es.getValue().contains(ext.toLowerCase()))
                .map(Entry::getKey).findFirst();
    }

    public Optional<String> getMimeFor(File file) {
        if (file.exists() && file.isFile()) {
            String[] p = file.getName().split("\\.");
            return getMimeFor(p[p.length - 1]);
        }
        return Optional.empty();
    }

}
