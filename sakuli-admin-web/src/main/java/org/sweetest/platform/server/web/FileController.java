package org.sweetest.platform.server.web;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpEntity;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.HandlerMapping;
import org.sweetest.platform.server.api.file.FileModel;
import org.sweetest.platform.server.api.file.FileSystemService;
import org.sweetest.platform.server.api.file.MimeTypeMap;
import org.sweetest.platform.server.api.project.ProjectService;

import javax.servlet.http.HttpServletRequest;
import java.io.File;
import java.io.IOException;
import java.util.List;
import java.util.Optional;
import java.util.function.Function;
import java.util.function.Predicate;
import java.util.stream.Collectors;

@Controller
@RequestMapping(FileController.RequestBasePath)
public class FileController {

    final static String RequestBasePath = "api/files";

    @Autowired
    private FileSystemService fileSystemService;

    @GetMapping(value = "ls")
    @ResponseBody
    public ResponseEntity<List<FileModel>> getFiles(
            @RequestParam("path") String path,
            @RequestParam("filter") Optional<String> filter
    ) {
        if(fileSystemService.fileExists(path)) {
            List<FileModel> files = fileSystemService.getFiles(path)
                    .filter(FileSystemService.hiddenFiles)
                    .filter(createFilter(filter))
                    .map(FileSystemService.toFileModel.apply(path))
                    .collect(Collectors.toList());
            return ResponseEntity.ok(files);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    private Predicate<File> createFilter(Optional<String> optionalFilter) {
        Predicate<File> noFilter = f -> true;
        Function<String, Predicate<File>> byFilter = filter -> file -> file.getName().matches(filter);
        return optionalFilter
                .map(byFilter)
                .orElse(noFilter);
    }

    @GetMapping()
    @ResponseBody
    public ResponseEntity<Resource> readFile(@RequestParam("path") String path) {
        MediaType mediaType = MimeTypeMap
                .getInstance()
                .getMimeForPath(path)
                .map(MediaType::parseMediaType)
                .orElse(MediaType.APPLICATION_OCTET_STREAM);
        return fileSystemService.readFile(path)
                .map(ResponseEntity
                        .ok()
                        .contentType(mediaType)::body)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping()
    @ResponseBody
    public ResponseEntity writeFile(
            @RequestParam("path") String path,
            @RequestParam("file") MultipartFile file) throws IOException {
        boolean success = fileSystemService.writeFile(path, file.getBytes());
        return success ? ResponseEntity.ok().build() : ResponseEntity.badRequest().build();
    }

    @DeleteMapping()
    public ResponseEntity deleteFile(@RequestParam("path") String path) {
        boolean success = fileSystemService.deleteFile(path);
        return success ? ResponseEntity.ok().build() : ResponseEntity.badRequest().build();
    }
}
