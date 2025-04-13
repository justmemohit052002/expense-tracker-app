import { firestore } from "@/config/firebase";
import { ResponseType,TransactionType, WalletType } from "@/types";
import { collection, doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { uploadFileToCloudinary } from "./imageService";
import { createOrUpdateWallet } from "./walletServices";


export const creaOrUpdateTransaction = async(
    transactionData : Partial<TransactionType>
    
): Promise<ResponseType> => {
    try {
        const { id, type, walletId, amount,image } = transactionData;
        if (!amount || amount <= 0 || !walletId || !type) {
            return { success: false, msg: "Invalid transaction data" };
        }
        if (id) {
            //todo : update existing transaction
            const oldTransactionSnapsht = await getDoc(doc(firestore, "transactions", id));
            const oldTransaction = oldTransactionSnapsht.data() as TransactionType;
            const shouldRevertOriginal = oldTransaction.type != type || oldTransaction.amount != amount || oldTransaction.walletId != walletId;
            if (shouldRevertOriginal) {
                let res = await revertAndUpdateWallets(oldTransaction, Number(amount), type, walletId);
                if(!res.success) return res;
            }
        }
        else {
            //todo : create or update for new transaction
            let res = await updateWalletForNewTransaction(
                walletId!,
                Number(amount),
                type
            )
            if(!res.success) return res;
        }

        if (image) {
      const imageUploadRes = await uploadFileToCloudinary(
          image,
          "transactions"
      );
      if (!imageUploadRes.success) {
        return {
          success: false,
          msg: imageUploadRes.msg || "Failed to upload receipt",
        };
      }
      transactionData.image = imageUploadRes.data;
        }
        
        const transactionRef = id ? doc(firestore, "transactions", id) : doc(collection(firestore, "transactions"));
        
        await setDoc(transactionRef, transactionData, { merge: true });

        return { success: true , data:{...transactionData, id: transactionRef.id} };
    }
    catch (err: any) {
        console.log("error updating transaction", err);
        return { success: false, msg: err.message };
    }
}
const updateWalletForNewTransaction = async(
    walletId: string,
    amount: number,
    type: string
) => {
    try {
        const walletRef = doc(firestore, "wallets", walletId);
        const walletSnap = await getDoc(walletRef);
        if (!walletSnap.exists()) {
            console.log("wallet not found");
            return { success: false, msg: "Wallet not found" };
        }
        const walletData = walletSnap.data() as WalletType;

        if (type == "expense" && walletData.amount! - amount < 0) {
             return { success: false, msg: "Selected wallet do not have enough funds" };
        }
        const updateType = type == 'income' ? "totalIncome" : "totalExpenses";
        const updatedWalletAount = type == "income" ? Number(walletData.amount) + amount : Number(walletData.amount) - amount;
        const updatedTotals = type == "income" ? Number(walletData.totalExpenses) + amount : Number(walletData.amount) + amount;
        
        await updateDoc(walletRef, {
            amount: updatedWalletAount,
            [updateType]: updatedTotals
        });
        return { success: true };
    }
    catch (err: any) {
        console.log("error  updating the new transaction", err);
        return { success: false, msg: err.message };
    }
}


const revertAndUpdateWallets = async(
    oldTransaction: TransactionType,
    newTransactionAmount: number,
    newTransactionType: string,
    newWalletId: string
) => {
    try {
        const orignalWalletSnapshot = await getDoc(
            doc(firestore, "wallets", oldTransaction.walletId

            ));
        
            const orignalWallet = orignalWalletSnapshot.data() as WalletType;
            
        let newWalletSnapshot = await getDoc(
            doc(firestore, "wallets", newWalletId

            ));
        let newWallet = newWalletSnapshot.data() as WalletType;
        const revertType = oldTransaction.type == 'income' ? "totalIncome" : "totalExpenses";
        
        const revertIncomeExpense: number = oldTransaction.type == 'income' ? -Number(oldTransaction.amount) : Number(oldTransaction.amount);

        const revertedWalletAmount = Number(orignalWallet.amount) + revertIncomeExpense;
        // wallet amount , after the transaction is removed

        const revertedIncomeExpenseAmount = Number(orignalWallet[revertType]) - Number(oldTransaction.amount);

        if (newTransactionType == 'expense') {
            // if user tries to convert income to expense on the same wallet
            // or if the user tries to increase the expense amount and  dont have enough funds
            
            if (oldTransaction.walletId == newWalletId && revertedWalletAmount < newTransactionAmount) {
                return { success: false, msg: "Selected wallet do not have enough funds" };
            }

            // if user tries to convert income to expense on the different wallet
            if (newWallet.amount! < newTransactionAmount) {
                return { success: false, msg: "Selected wallet do not have enough funds" };
            }
        }

        await createOrUpdateWallet({
            id: oldTransaction.walletId,
            amount: revertedWalletAmount,
            [revertType]: revertedIncomeExpenseAmount,
            
        });
        /////////////////////////////////////////////////////////////////////////////////////////////
        
        // refetch the new wallet because we might have changed the wallet amount
       newWalletSnapshot = await getDoc(
            doc(firestore, "wallets", newWalletId

            ));
        newWallet = newWalletSnapshot.data() as WalletType;

        const updateType = newTransactionType == 'income' ? "totalIncome" : "totalExpenses";
        
        const updatedTransactionAmount: number = newTransactionType == 'income' ? Number(newTransactionAmount) : -Number(newTransactionAmount);

        const newWalletAmount = Number(newWallet.amount) + updatedTransactionAmount;

        const newIncomeExpemseAmount = Number(newWallet[updateType]! + Number(newTransactionAmount))

        await createOrUpdateWallet({
            id: newWalletId,
            amount: newWalletAmount,
            [updateType]: newIncomeExpemseAmount,
        })
        return { success: true };
    }
    catch (err: any) {
        console.log("error  updating the new transaction", err);
        return { success: false, msg: err.message };
    }
}