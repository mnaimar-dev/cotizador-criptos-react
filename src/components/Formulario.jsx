import styled from '@emotion/styled'
import { useState } from 'react'
import { useEffect } from 'react'
import { monedas } from '../data/monedas'
import useSelectMonedas from '../hooks/useSelectMonedas'
import Error from './Error'

const InputSubmit = styled.input`
    background-color: #9497FF;
    border: none;
    width: 100%;
    padding: 10px;
    color: #FFF;
    font-weight: 700;
    text-transform: uppercase;
    font-size: 20px;
    border-radius: 5px;
    transition: background-color .3s ease;
    margin-top: 2rem;

    &:hover {
        background-color: #7A7DFE;
        cursor: pointer;
    }
`

const Formulario = ({ setMonedas }) => {

    const [ criptos, setCriptos ] = useState([])
    const [ error, setError ] = useState(false)

    const [ moneda, SelectMonedas ] = useSelectMonedas('Elige tu Moneda', monedas);
    const [ criptomoneda, SelectCriptomoneda ] = useSelectMonedas('Elige tu Criptomoneda', criptos);

    // Este useEffect manda a llamar a la API luego de que el componente está cargado
    useEffect(() => {
        const consultarAPI = async () => {
            const url = "https://min-api.cryptocompare.com/data/top/mktcapfull?limit=50&tsym=USD";
            const respuesta = await fetch(url);
            const resultado = await respuesta.json();

            const arrayCriptos = resultado.Data.map( cripto => {

                    const objeto = {
                        id: cripto.CoinInfo.Name,
                        nombre: cripto.CoinInfo.FullName
                    }

                    return objeto;
            } );

            setCriptos(arrayCriptos);
        }
        consultarAPI();
    }, [])

    const handleSubmit = (e) => {
        e.preventDefault();

        if([moneda, criptomoneda].includes('')) {
            setError(true);
            return;
        }

        setError(false);
        setMonedas({
            moneda,
            criptomoneda
        })
    }

  return (
    <>
        {/* ⬇️ Si el error es true --> Imprime "Todos los campos son obligatorios"⬇️ */}
        {/* "Todos los campos..." pasa como "children" al componente error */}
        { error && <Error>Todos los campos son obligatorios</Error> }
        <form 
            onSubmit = { handleSubmit }
            action=""
        >
            <SelectMonedas />
            <SelectCriptomoneda/>

            <InputSubmit 
                type="submit" 
                value="Cotizar" 
            />
        </form>
    </>
  )
}

export default Formulario