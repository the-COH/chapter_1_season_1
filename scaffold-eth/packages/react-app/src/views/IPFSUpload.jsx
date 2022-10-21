import { useState } from "react";
import { create as ipfsHttpClient } from "ipfs-http-client";
import { ConstructorFragment } from "ethers/lib/utils";

const projectId = "projectId";
const projectSecret = "projectSecret";
const authorization = "Basic " + btoa(projectId + ":" + projectSecret);

const ipfs = ipfsHttpClient({
  url: "https://ipfs.infura.io:5001/api/v0",
  headers: {
    authorization
  }
})

export default function IPFSUpload() {

  const [path, setPath] = useState();

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    const form = event.target;
    const files = (form[0]).files;

    if (!files || files.length === 0) {
      return alert("No files selected");
    }

    const file = files[0];

    if (file.size / 1024 > 5120) {
      return alert("The max file size is 5MB.");
    }
    // upload files
    try {
      const result = await ipfs.add(file);
      setPath(result.path);
    } catch (error) {
      return alert("There was an error uploading your file to IPFS")
    }
  }

  return (
    <div>
      <div style={{ margin: 32 }}>
      <form onSubmit={onSubmitHandler}>
            <input type="file" name="file"/>
            <button type="submit">Upload file</button>
          </form>
      </div>
      <div style={{ margin: 32 }}>
        <p>
        <a href={"https://thoth.infura-ipfs.io/ipfs/" + path}>
          {(path) ? "Your file has been uploaded to IPFS with path " + path : null}
        </a>
        </p>
      </div>
     </div>
  );

}
