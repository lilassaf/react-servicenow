function Col({type, name}){
    return(
        type === "head" ? <th scope="col">{name}</th>:<td scope="col"> {name} </td>
    )
}

export default Col;