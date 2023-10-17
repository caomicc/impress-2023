export function buildMovieClip(library, libraryUrl) {
  let constructorName;
  try {
    const fileName = decodeURI(libraryUrl).split("/").pop();
    const fileNameWithoutExtension = fileName?.split(".")[0];
    constructorName = fileNameWithoutExtension?.replace(/[ -]/g, "");
    if (constructorName?.match(/^[0-9]/)) {
      constructorName = "_" + constructorName;
    }
  } catch (e: any) {
    throw new Error(
      `Movie libraryUrl ${JSON.stringify(
        libraryUrl
      )} did not match expected format: ${e.message}`
    );
  }

  const LibraryMovieClipConstructor = library[constructorName];
  if (!LibraryMovieClipConstructor) {
    throw new Error(
      `Expected JS movie library ${libraryUrl} to contain a constructor ` +
    `named ${constructorName}, but it did not: ${Object.keys(library)}`
    );
  }
  const movieClip = new LibraryMovieClipConstructor();

  return movieClip;
  }
