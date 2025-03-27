import { ResponseType, WalletType } from "@/types";
import { uploadFileToCloudinary } from "./imageService";
import { collection, deleteDoc, doc, setDoc } from "firebase/firestore";
import { firestore } from "@/config/firebase";

export const createOrUpdateWallet = async (
    walletData: Partial<WalletType>
): Promise<ResponseType> => {
    try {
        let walletToSave = { ...walletData };
        if (walletData.image) {
            const imageUploadRes = await uploadFileToCloudinary(
                walletData.image,
                "wallets"
            );
            if (!imageUploadRes.success) {
                return {
                    success: false,
                    msg: imageUploadRes.msg || "Failed to upload wallet icon",
                };
            }
            walletToSave.image = imageUploadRes.data;
        }

        if (!walletData?.id) {
            //new wallet
            walletToSave.amount = 0;
            walletToSave.totalIncome = 0;
            walletToSave.totalExpenses = 0;
            walletToSave.created = new Date();
        }
        const walletRef = walletData.id ? doc(firestore, "wallets", walletData?.id) :
            doc(collection(firestore, "wallets"));
        await setDoc(walletRef, walletToSave, { merge: true })   //update only the data provided
        return { success: true, data: { ...walletToSave, id: walletRef.id } };
    } catch (error: any) {
        console.log('got error creating wallet', error);
        return { success: false, msg: error.message };
    }
};

export const deleteWallet = async (walletId: string): Promise<ResponseType> => {
    try {
        const walletRef = doc(firestore, "wallets", walletId);
        await deleteDoc(walletRef);

        // todo: delete all transactions in this wallet
        return { success: true, msg: "Wallet deleted successfully" };
    } catch(err: any){
        console.log('error deleting wallet', err);
        return { success: false, msg: err.message };
    }
}