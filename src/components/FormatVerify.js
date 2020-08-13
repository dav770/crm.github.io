

export function email (e){

    let lastAtPos = e.props.value.lastIndexOf("@");
    let lastDotPos = e.props.value.lastIndexOf(".");

    if (lastAtPos <= 0 || lastDotPos <= 0) {
        
        return {err: true, message: 'adresse email non valide'};

    } else {

        return {err: false, message: ''};
    }

}


export function password(e){
    const lowerCase = new RegExp("^(?=.*[az])")
    const upperCase = new RegExp("^(?=.*[AZ])")
    const numCase = new RegExp("^(?=.*[0-9])")
    const specialCase = new RegExp("^(?=.[!@#$%^&])")
    // const minimunCase = new RegExp("^(? =. {8,})")
    const strongRegex = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})");

    if (strongRegex.test(e.props.value)){
        return {err: false, message: ''};
    }else{
        return {err: true, message: 'le password doit contenir au moins 8 caracteres, 1 majuscule, 1 minuscule et 1 caractere special'};
    }

}

export function length(e){
    if (e.props.value.length < 3) {
          return {err: true, message: 'le nom doit contenir au moins 6 caracteres'};
      } else {
        return {err: false, message: ''};
      }
}

