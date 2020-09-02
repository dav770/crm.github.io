

export function email (e, data){
if(data !== '' && data !== null){
    let lastAtPos = data.lastIndexOf("@");
    let lastDotPos = data.lastIndexOf(".");

    if (lastAtPos <= 0 || lastDotPos <= 0) {
        
        return {err: true, message: 'adresse email non valide'};

    } else {

        return {err: false, message: ''};
    }
}else{
    let lastAtPos = e.props.value.lastIndexOf("@");
    let lastDotPos = e.props.value.lastIndexOf(".");

    if (lastAtPos <= 0 || lastDotPos <= 0) {
        
        return {err: true, message: 'adresse email non valide'};

    } else {

        return {err: false, message: ''};
    }
}
    

}


export function password(e, data){
    const lowerCase = new RegExp("^(?=.*[az])")
    const upperCase = new RegExp("^(?=.*[AZ])")
    const numCase = new RegExp("^(?=.*[0-9])")
    const specialCase = new RegExp("^(?=.[!@#$%^&])")
    // const minimunCase = new RegExp("^(? =. {8,})")
    const strongRegex = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})");

    if(data !== '' && data !== null){

        if (strongRegex.test(data)){
            return {err: false, message: ''};
        }else{
            return {err: true, message: 'le password doit contenir au moins 8 caracteres, 1 majuscule, 1 minuscule et 1 caractere special'};
        }
    }else{

        if (strongRegex.test(e.props.value)){
            return {err: false, message: ''};
        }else{
            return {err: true, message: 'le password doit contenir au moins 8 caracteres, 1 majuscule, 1 minuscule et 1 caractere special'};
        }
    }


}

export function length(e, data){
    console.log('dans verif length',data.length, data);
    if(data !== '' && data !== null){
        if (data.length < 3) {
            console.log('dans verif length',e);
              return {err: true, message: 'le nom doit contenir au moins 6 caracteres'};
          } else {
            return {err: false, message: ''};
          }
    }else{
        if (e.props.value.length < 3) {
            console.log('dans verif length',e);
              return {err: true, message: 'le nom doit contenir au moins 6 caracteres'};
          } else {
            return {err: false, message: ''};
          }
    }
    
}

