import { CardProps, card as cardInterface } from './types'


//   const Card = (props:cardInterface):JSX.Element => {
    const Card = (props:CardProps):JSX.Element => {
        var src = `/cards/${props.value}-${props.suit}.png`;
    return (
        <div className="CardComponent">
            <img className="CardComponent__img" src={props.image}></img>
            <style jsx>
                {`
                    .CardComponent {
                        display: inline-block;
                        height: 120px;
                        width: 90px;
                        margin: 5px;
                    }

                    .CardComponent__img {
                        height: 100%;
                        width: 100%;
                        object-fit: fill;
                    }
                `}
            </style>
        </div>
    )
}

export default Card