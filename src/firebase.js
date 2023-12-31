import {
  GoogleAuthProvider,
  getAuth,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signOut,
} from "firebase/auth";
import {getFirestore,query,getDocs,collection,where,addDoc,doc,setDoc,updateDoc, arrayUnion} from "firebase/firestore";
import { initializeApp } from "firebase/app";
import { useAuthState } from "react-firebase-hooks/auth";

const firebaseConfig = {
  // removed for privacy
  };

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const googleProvider = new GoogleAuthProvider();

const signInWithGoogle = async () => {
    try {
      const res = await signInWithPopup(auth, googleProvider);
      const user = res.user;
      const q = query(collection(db,"users"),where("uid","==",user.uid));
      const docs = await getDocs(q);
      if (docs.docs.length===0){
        await setDoc(doc(db,"users",user.uid),{
          uid : user.uid,
          quizes: []
        })
      }
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
  };

const logout = () => {
  signOut(auth);
};

const logInWithEmailAndPassword = async (email, password) => {
  try {
    await signInWithEmailAndPassword(auth, email, password);
  } catch (err) {
    console.error(err);
    alert(err.message);
  }
};

const registerWithEmailAndPassword = async (name, email, password) => {
  try {
    const res = await createUserWithEmailAndPassword(auth, email, password);
    const user = res.user;
    await setDoc(doc(db,"users",user.uid),{
      uid : user.uid,
      quizes: []
    })
  } catch (err) {
    console.error(err);
    alert(err.message);
  }
};

const sendPasswordReset = async (email) => {
  try {
    await sendPasswordResetEmail(auth, email);
    alert("Password reset link sent!");
  } catch (err) {
    console.error(err);
    alert(err.message);
  }
};


const add_quiz = async (Title,quiz_duration,question_list) =>{
  try{
    //console.log("question list when add_quiz: ",question_list);
    const docref = await addDoc(collection(db,"quizes"),{
      Title : Title,
      quizDuration: quiz_duration,
    });
    const docref2 = doc(db,"users",auth.currentUser.uid);
    await updateDoc(docref2,{
      quizes : arrayUnion(docref.id)
    })

    // create collection for question_list
    const colref = collection(db,"quizes",docref.id,"Questions");
    //console.log(question_list);
    question_list.map(async(question_info,idx)=>{
      //console.log("yi yi",question_info);
        await addDoc(colref,{
          description: question_info.desc,
          option1 : question_info.option1,
          option2 : question_info.option2,
          option3 : question_info.option3,
          option4 : question_info.option4,
          answer : question_info.answer
        })
    })
  }catch(err){
    alert(err);
  }
}

export {
    auth,
    db,
    signInWithGoogle,
    logout,
    add_quiz,
    signInWithEmailAndPassword,
    logInWithEmailAndPassword,
    sendPasswordResetEmail,
    registerWithEmailAndPassword,
    sendPasswordReset,
  };
