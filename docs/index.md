# File Versions

For the archive and its website to work correctly we require several versions of each asset. Each version follows the same naming convention.

`{version_prefix}-{master_file_sha1_value}`

e.g. `w-2aae6c35c94fcfb415dbe95f408b9ce91ee846ed` This would be the 'web' version of the master file that has the SHA1 hash value of 2aae6c35c94fcfb415dbe95f408b9ce91ee846ed.

All derivations of the master file retain the SHA1 hash of that master version, this allows us to link them together and ultimately back to the source.

## SHA1 Hash Value

A file hash is a way of representing the digital contents of a file in a string of characters. We use this as the master identifier for our assets for the following reasons;

1. It provides us with a unique identifier for each master file we hold (this is technically not a certainty but is the probability of it not being true are [astronomically high.](https://grayson.sh/blogs/calculating-odds-of-sha1-collision)
2. We can link the physical file back to the database and any metadata it has.
3. We can link orphaned or unidentified files back to a record if one exists - this is done by measuring the hash value and searching the database `file_id` column for a match.

### Master

The master version is the raw file whether it was delivered in a digital format or we created it through the digitisation process.

### Web

The web version of the file is what is used on our website. It is a converted version of the master file to allow for it to be displayed. The format depends on the type of source file.

### Transcription

For audio and video files we generate a transcription file that is used to display the subtitles for audio and video records.

# Digitising

## Audio

Audio that is already in a digital file format
Retain as is with no alteration
