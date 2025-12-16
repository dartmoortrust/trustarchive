## Media Management

Processed files will all conform to the following format when saved in blob storage (currently Azure).

All files are stored as their SHA1 hash. For example `99e1a663ce714db8f6e25b8bf9c303ffc57013bf`
Files are stored in subfolders to reduce the number of files at a single level. The sub folder's name comprises the first two characters from the file's name. For example `99/99e1a663ce714db8f6e25b8bf9c303ffc57013bf`

Files are not saved with their extentions to make addressing them easier where multiple mime extentions are possible.

| Prefix | Purpose                                                                   | Example                                      |
| ------ | ------------------------------------------------------------------------- | -------------------------------------------- |
| None   | The master file - unchanged                                               | `99e1a663ce714db8f6e25b8bf9c303ffc57013bf`   |
| w-     | The web version - this is what we use to display the file on our website. | `w-99e1a663ce714db8f6e25b8bf9c303ffc57013bf` |
| s-     | A video still used as a thumbnail                                         | `s-99e1a663ce714db8f6e25b8bf9c303ffc57013bf` |
