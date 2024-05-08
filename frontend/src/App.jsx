import React, { useEffect, useState } from "react";
import "./App.css";
import Axios from "axios";
import Card from "./components/cards/card";
import { Input, TextField, Button, Container, Typography } from "@material-ui/core";
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  root: {
    '& > *': {
      margin: theme.spacing(1),
    },
    '& .label': {
      color: 'black', // Definindo a cor do texto para preto
    },
  },
}));

export default function App() {
  const classes = useStyles();
  const [values, setValues] = useState();
  const [listCard, setListCard] = useState([]);
  const [showAll, setShowAll] = useState(false);
  console.log(listCard);

  const handleShowAll = () => {
    setShowAll(true);
  };

  const handleRegisterGame = () => {
    Axios.post("http://localhost:3001/register", {
      name: values.name,
      cost: values.cost,
      category: values.category,
    }).then(() => {
      Axios.post("http://localhost:3001/search", {
        name: values.name,
        cost: values.cost,
        category: values.category,
      }).then((response) => {
        setListCard([
          ...listCard,
          {
            id: response.data[0].id,
            name: values.name,
            cost: values.cost,
            category: values.category,
          },
        ]);
      });
    });
  };

  useEffect(() => {
    Axios.get("http://localhost:3001/getCards").then((response) => {
      setListCard(response.data);
    });
  }, []);

  const handleaddValues = (value) => {
    setValues((prevValues) => ({
      ...prevValues,
      [value.target.name]: value.target.value,
    }));
  };

  return (
    <Container maxWidth="sm">
      <div className={classes.root}>
        <Typography variant="h4" component="h2" gutterBottom>
          Crud Motors
        </Typography>

        <TextField
          type="text"
          name="name"
          label={<span className="label">Veículo</span>} // Aplicando a classe "label" ao label
          variant="outlined"
          onChange={handleaddValues}
        />
        <TextField
          type="text"
          label={<span className="label">Preço</span>} // Aplicando a classe "label" ao label
          name="cost"
          variant="outlined"
          onChange={handleaddValues}
        />
        <TextField
          type="text"
          label={<span className="label">Categoria</span>} // Aplicando a classe "label" ao label
          name="category"
          variant="outlined"
          onChange={handleaddValues}
        />

        <Button variant="contained" color="primary" onClick={handleRegisterGame}>
          Cadastrar
        </Button>

        <Button variant="contained" color="secondary" onClick={handleShowAll}>
          Ver Cadastros
        </Button>
      </div>

      {showAll && listCard.map((val) => (
        <Card
          listCard={listCard}
          setListCard={setListCard}
          key={val.id}
          id={val.id}
          name={val.name}
          cost={val.cost}
          category={val.category}
        />
      ))}
    </Container>
  );
}
