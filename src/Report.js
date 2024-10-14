import { IonIcon } from "@ionic/react";
import { arrowForward } from "ionicons/icons";
import { useState } from "react";
import { db } from "./firebase";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { v4 as uuidv4 } from "uuid";

function Report() {
    const [loadingText, setLoadingText] = useState("");
    async function handleSubmit() {
        const content = document.getElementById("report-content");
        if (!(content.value == 0)) {
            console.log(content.value);
            setLoadingText("Sending... ");
            const reportRef = doc(db, "reports", uuidv4().toString());
            const repsonse = await setDoc(reportRef, {
                time: serverTimestamp(),
                content: content.value,
            })
                .then(() => {
                    setLoadingText("Report successfully submitted!");
                    content.value = "";
                })
                .catch(() => {
                    setLoadingText("Error sending report.");
                });
        } else {
            setLoadingText("Cannot submit empty report");
        }
    }

    return (
        <div className="bg-slate-200 h-[92vh] flex flex-col justify-center items-center font-[Poppins]">
            <h1 className="font-semibold text-3xl m-3">Report A Bug</h1>
            <div className="flex flex-row w-1/2 text-center items-center">
                <input
                    id="report-content"
                    type="text"
                    placeholder="There's a really big spider in my room!"
                    className="h-16 w-full bg-slate-50 p-2 rounded-xl"
                ></input>
                <IonIcon
                    onClick={() => {
                        handleSubmit();
                    }}
                    icon={arrowForward}
                    className="text-3xl size-10 p-3 m-2 bg-wisco-700 rounded-xl text-slate-200 cursor-pointer active:bg-wisco-600 active:scale-95"
                >
                    <button id="report"></button>
                </IonIcon>
            </div>
            {loadingText && <div className="text-center">{loadingText}</div>}
        </div>
    );
}
export default Report;
