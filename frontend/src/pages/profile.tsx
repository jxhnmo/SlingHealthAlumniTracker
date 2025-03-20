import React from "react";
import Link from "next/link";


interface User {
  id: string; // unique user id
  user_profile_url: string;
  name: string;
  year: string;
  major: string;
  bio?: string;
  achievements?: string;
  contact?: string;
}


const Profile: React.FC = () => {
  const loggedInId = "jomgos"; // me


  const user: User = {
    id: "jomgos", // profile owner's id
    user_profile_url: "/profilePix/default.jpg",
    name: "Sabrina Carpet",
    year: "2024",
    major: "Computer Science",
    bio: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    achievements: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    contact: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
  };


  const [isEditing, setIsEditing] = React.useState(false);
  const [editedUser, setEditedUser] = React.useState<User>(user);


  const [isUploading, setIsUploading] = React.useState(false); // user uploading image
  const [tooLarge, setTooLarge] = React.useState(false); // if image is too large
  const photoInputRef = React.useRef<HTMLInputElement | null>(null); // HTML element for the image input
  const [imageURLs, setImageURLs] = React.useState<string>(user.user_profile_url); // user profile URL by default
  const [selectedImage, setSelectedImage] = React.useState(null);
  let queuedImage: File[] = []; // queue with only 1 element



  const handleEdit = () => {
    setIsEditing(true);
  };

  // const checkImageDims = (file: File) => {
  //   var reader = new FileReader();
  //   reader.onload = function(e) {

  //   }
  // };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setEditedUser({ ...editedUser, [name]: value });
  };

  const handleSave = async () => {
    // u guys set this up
    setIsEditing(false);
    try { // TODO: save image
      const response = await fetch(`/api/profile/${user.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editedUser),
      });

      if (!response.ok) throw new Error("Failed to update profile");

      setIsEditing(false);
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  return (
    <div className="relative w-screen h-screen flex justify-center items-center">
      {/* background img */}
      {/* <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat blur-md"
        style={{ backgroundImage: "url('/background.jpg')" }}
      /> */}

      {/* nav */}
      <nav className="absolute top-5 right-10 flex gap-3 z-20">
        {[
          { name: "Home", path: "/" },
          { name: "Index", path: "/userIndex" },
          { name: "Profile", path: "/profile" },
          { name: "Login", path: "/login" },
          // { name: "Edit", path: "/profileEdit" },
        ].map((item) => (
          <Link
            key={item.name}
            href={item.path}
            className="px-4 py-2 text-[--popcol] bg-[--dark2] rounded-md shadow-lg transition 
                       hover:bg-[--popcol] hover:text-[--dark2] hover:scale-105"
          >
            {item.name}
          </Link>
        ))}
      </nav>

      <div className="w-screen h-screen px-[5%] flex flex-col justify-start items-center gap-[48px] p-10">
        <div className="mt-5 pt-[12px]">
          <h1 className="text-center text-5xl font-bold text-white">profile</h1>
        </div>

        <div className="w-[80%] h-[80%] bg-[--dark2] rounded-2xl shadow-xl p-[2%]">
          <div className="w-full flex justify-end p-2">
            {loggedInId === user.id && (
              <button
                onClick={isEditing ? handleSave : handleEdit}
                className="px-4 py-2 bg-[--background] text-[--popcol] rounded-md shadow-lg transition 
                           hover:bg-[--popcol] hover:text-[--dark2] hover:scale-105"
              >
                {isEditing ? "Save" : "Edit"}
              </button>
            )}
          </div>


          <div className="w-full h-full flex flex-col items-center gap-5">
            <div className="h-[250px] w-[250px]">
              {isEditing ? ( // editing for pfp
                <div>
                  <img
                    src={imageURLs}
                    alt={user.name}
                    className="w-auto h-full rounded-[10px] object-cover aspect-square"
                  />
                  <button
                    disabled={isUploading}
                    onClick={() => {
                      photoInputRef.current?.click();
                    }
                  }>{isUploading ? "Uploading..." : "Upload"}</button>
                  <p>{tooLarge ? "Image is too large! Must be under 5MB" : "Images must be under 5MB"}</p>
                  <input ref={photoInputRef}
                    type="file"
                    className="absolute right-[9999px]"
                    id="imageInput"
                    accept="image/png, image/jpeg"
                    disabled={isUploading}
                    onChange={ (e) => {
                      if(!e.target.files) return;
                        // console.log(e.target.files);
                        var fileOld = e.target.files[0];
                        if(fileOld == null) {
                          return;
                        }
                        if(fileOld.size > 500000) {
                          setTooLarge(true);
                          return;
                        }
                        setTooLarge(false);
                        var oldName = fileOld.name;
                        var name = user.id + "." + oldName.substring(oldName.lastIndexOf('.')+1, oldName.length)/* || oldName*/; // CHANGE TO CORRECT TYPE
                        const renamedFile = new File([fileOld], name);
                        // setSelectedImage(renamedFile); // its not null trust me bro
                        queuedImage.pop(); // change queued image
                        queuedImage.push(renamedFile);
                        console.log(queuedImage);
                        setImageURLs(URL.createObjectURL(renamedFile));
                        console.log(imageURLs);
                        console.log(renamedFile);
                    }}>
                  </input>
                </div>
              ) : ( // not editing for pfp
                <img
                  src={user.user_profile_url}
                  alt={user.name}
                  className="w-auto h-full rounded-[10px] object-cover aspect-square"
                />
              )}

              
            </div>
            {/* name, major, year */}
            {isEditing ? (
              <>
                <input
                  type="text"
                  name="name"
                  value={editedUser.name}
                  onChange={handleChange}
                  placeholder="Name"
                  className="text-3xl font-bold text-center bg-[--dark2] text-[--popcol] border-b-2 border-[--popcol] outline-none"
                />

                <div className="flex justify-center gap-4">
                  <input
                    type="text"
                    name="major"
                    value={editedUser.major}
                    onChange={handleChange}
                    placeholder="Major"
                    className="text-xl font-bold text-center bg-[--dark2] text-white border-b-2 border-white outline-none"
                  />
                  <input
                    type="text"
                    name="year"
                    value={editedUser.year}
                    onChange={handleChange}
                    placeholder="Year"
                    className="text-xl font-bold text-center bg-[--dark2] text-white border-b-2 border-white outline-none"
                  />
                </div>
              </>
            ) : (
              <>
                <h1 className="text-3xl font-bold text-[--popcol]">
                  {editedUser.name}
                </h1>
                <h2 className="text-xl font-bold text-white">
                  {editedUser.major} Class of {editedUser.year}
                </h2>
              </>
            )}

            {/* bio, achievements, contact */}
            <div className="w-full h-[50%] bg-[] flex justify-between gap-5 mt-5">
              <div className="w-1/3 h-[full] bg-[--grey1] rounded-xl p-5 text-white">
                <h3 className="text-lg font-bold mb-3 text-center text-[--popcol]">
                  Bio
                </h3>
                {isEditing ? (
                  <textarea
                    name="bio"
                    value={editedUser.bio}
                    onChange={handleChange}
                    placeholder="Bio"
                    className="w-full h-[90%] bg-[--dark2] text-[--popcol] outline-none p-2"
                  />
                ) : (
                  <p>{editedUser.bio}</p>
                )}
              </div>

              <div className="w-1/3 h-[full] bg-[--grey1] rounded-xl p-5 text-white">
                <h3 className="text-lg font-bold mb-3 text-center text-[--popcol]">
                  Achievements
                </h3>
                {isEditing ? (
                  <textarea
                    name="achievements"
                    value={editedUser.achievements}
                    onChange={handleChange}
                    placeholder="Achievements"
                    className="w-full h-[90%] bg-[--dark2] text-[--popcol] outline-none p-2"
                  />
                ) : (
                  <p>{editedUser.achievements}</p>
                )}
              </div>

              <div className="w-1/3 h-[full] bg-[--grey1] rounded-xl p-5 text-white">
                <h3 className="text-lg font-bold mb-3 text-center text-[--popcol]">
                  Contact Information
                </h3>
                {isEditing ? (
                  <textarea
                    name="contact"
                    value={editedUser.contact}
                    onChange={handleChange}
                    placeholder="Contact Information"
                    className="w-full h-[90%] bg-[--dark2] text-[--popcol] outline-none p-2"
                  />
                ) : (
                  <p>{editedUser.contact}</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;