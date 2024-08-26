import React from 'react';
import { Link } from 'react-router-dom';


export default function Post({ posts, handleDislike,  handleLike, firstImage, email, _id }) {


  return (
  <div className="Post-Componente">
    <img src={firstImage} alt={email} className="Post-Componente__img" />
    <div className="Post-Componente__acciones">
      <div className="Post-Componente__like-container">

         <button onClick={() => handleDislike(_id)} className="Post-Componente__boton-dislike">
            X
         </button>

         <button onClick={() => handleLike(_id)} className="Post-Componente__boton-like">
            Like
          </button>


      </div>

    </div>
  </div>



 
  );
}
