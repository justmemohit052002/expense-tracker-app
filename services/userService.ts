import { firestore } from "@/config/firebase";
import { UserDataType } from "@/types";
import { doc, setDoc } from "firebase/firestore";
import { uploadFileToCloudinary } from "./imageService";

export const updateUser = async (
  uid: string,
  updatedData: UserDataType
): Promise<ResponseType> => {
  //image upload panding
  try {
    if (updatedData.image && updatedData?.image?.uri) {
      const imageUploadRes = await uploadFileToCloudinary(
        updatedData.image,
        "users"
      );
      if (!imageUploadRes.success) {
        return {
          success: false,
          msg: imageUploadRes.msg || "Failed to upload image",
        };
      }
      updatedData.image = imageUploadRes.data;
    }
    const userRef = doc(firestore, "users", uid); // Changed "user" to "users"
    const userData = {
      name: updatedData.name,
      image: updatedData.image,
      updatedAt: new Date().toISOString(),
    };
    await setDoc(userRef, userData, { merge: true });
    return { success: true, msg: "User updated successfully" };
  } catch (error: any) {
    console.log("Error updating user", error);
    return { success: false, msg: error?.message };
  }
};
