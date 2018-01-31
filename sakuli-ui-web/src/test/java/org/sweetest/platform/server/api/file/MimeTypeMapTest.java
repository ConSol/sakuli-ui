package org.sweetest.platform.server.api.file;

import org.testng.annotations.BeforeClass;
import org.testng.annotations.Test;

import java.util.Optional;

import static org.testng.Assert.assertEquals;
import static org.testng.Assert.assertFalse;

public class MimeTypeMapTest {

    MimeTypeMap mimeType;

    @BeforeClass
    public void beforeClass() {
        mimeType = MimeTypeMap.getInstance();
    }

    @Test
    public void testGetMimeFor() throws Exception {
        Optional<String> jsMime = mimeType.getMimeFor("js");
        assertEquals(jsMime.get(), "application/x-javascript", ".js is javascript");

        Optional<String> unknownMime = mimeType.getMimeFor("fancy-extension");
        assertFalse(unknownMime.isPresent(), "unknown is not present");

    }

    @Test
    public void testRegEx() throws Exception {

    }

}