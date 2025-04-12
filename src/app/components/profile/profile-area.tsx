"use client";
import React, { useState } from "react";
import ProfileContent from "./profile-content";
import ProfileImage from "./profile-image";
import { useUpdateProfileMutation } from "@/redux/auth/authApi";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";

const ProfileArea = () => {
  const [profileImg, setProfileImg] = useState<string>("");
  const { user } = useSelector((state: RootState) => state.auth);

  const [updateProfile, { data: updateData }] = useUpdateProfileMutation();
  return (
    <>
      {/* <div className="bg-white rounded-md pt-10 mb-10">
        <ProfileImage setProfileImg={setProfileImg} updateData={updateData} />
      </div> */}
      <div className="">
        <h5 className="text-xl mb-0 capitalize">{user?.name}</h5>
      </div>
      {/* profile content start */}
      <ProfileContent profileImg={profileImg} updateProfile={updateProfile} />
      {/* profile content end */}
    </>
  );
};

export default ProfileArea;
