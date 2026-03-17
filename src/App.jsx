import { Delete } from '@mui/icons-material';
import { Button, TextField } from '@mui/material'
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
// import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import axios from 'axios';
import EditIcon from '@mui/icons-material/Edit';
import React, { useEffect, useState } from 'react'
import Switch from '@mui/material/Switch';

const App = () => {

  let api = "http://localhost:3002/data"

  let [data, setData] = useState([])
  let [trigger, setTrigger] = useState(false)

  let [nameEdit, setnameEdit] = useState("")
  let [aboutEdit, setabouteEdit] = useState("")
  let [imgEdit, setimgeEdit] = useState("")
  let [priceEdit, setpriceeEdit] = useState("")
  let [idx, setidx] = useState(null)
  let [statusEdit, setstatusEdit] = useState(null)


  let [search, setsearch] = useState("")
  let [selete, setselecte] = useState("")

  let showEdit = ((user) => {
    setnameEdit(user.name)
    setabouteEdit(user.about)
    setimgeEdit(user.img)
    setpriceeEdit(user.price)
    setidx(user.id)
    setstatusEdit(user.status)
  })


  const label = { inputProps: { 'aria-label': 'Switch demo' } };


  async function get() {
    try {
      let { data } = await axios.get(api)
      setData(data)
    } catch (error) {
      console.error(error);

    }
  }

  useEffect(() => {
    if (trigger) {
      get()
    }
    return (() => {
      setTrigger(true)
    })
  }, [trigger])


  async function handleSubmit(event) {
    try {
      event.preventDefault()
      await axios.post(api, {
        id: new Date(),
        name: event.target["name"].value,
        about: event.target["about"].value,
        img: event.target["img"].value,
        price: event.target["price"].value,
      })
      get()
    } catch (error) {
      console.error(error);

    }
  }

  async function handleSubmitEdit(event) {
    try {
      event.preventDefault()
      await axios.put(`${api}/${idx}`, {
        name: nameEdit,
        about: aboutEdit,
        img: imgEdit,
        price: priceEdit,
        status: statusEdit,
      })
      get()
    } catch (error) {
      console.error(error);

    }
  }

  async function changestatus(user) {
    try {
      await axios.put(`${api}/${user.id}`, {
        ...user,
        status: !user.status
      })
      get()
    } catch (error) {
      console.error(error);

    }
  }

  async function deleteuser(id) {
    try {
      await axios.delete(`${api}/${id}`)
      get()
    } catch (error) {
      console.error(error);

    }
  }

  async function searchname(name) {
    try {
      if(name == ""){
        get()
      }
      else{
       let {data} = await axios.get(`${api}?name=${name}`)
        setData(data)
      }
    } catch (error) {
      console.error(error);
      
    }
  }
  async function sel(select) {
    try {
      if(select == ""){
        get()
      }
      else{
       let {data} = await axios.get(`${api}?status=${select}`)
        setData(data)
      }
    } catch (error) {
      console.error(error);
      
    }
  }

  return (
    <>
      <section style={{ padding: "20px 100px" }}>
        <div style={{ display: "flex", gap: "30px",alignItems:"end" }}>
          <form onSubmit={handleSubmit} action="" style={{ display: "flex", flexDirection: 'column', width: "20%", gap: "10px" }}>
            <TextField name='name' id="name" label="Name" variant="outlined" />
            <TextField name='about' id="about" label="About" variant="outlined" />
            <TextField name='img' id="img" label="Image" variant="outlined" />
            <TextField name='price' id="price" label="Price" variant="outlined" />
            <Button type='submit' variant='contained'>Add</Button>
          </form>

          <form onSubmit={handleSubmitEdit} action="" style={{ display: "flex", flexDirection: 'column', width: "20%", gap: "10px" }}>
            <TextField value={imgEdit} onChange={(user) => setimgeEdit(user.target.value)} name='img' id="img" label="Image" variant="outlined" />
            <TextField value={nameEdit} onChange={(user) => setnameEdit(user.target.value)} name='name' id="name" label="Name" variant="outlined" />
            <TextField value={aboutEdit} onChange={(user) => setabouteEdit(user.target.value)} name='about' id="about" label="About" variant="outlined" />
            <TextField value={priceEdit} onChange={(user) => setpriceeEdit(user.target.value)} name='price' id="price" label="Price" variant="outlined" />
            <Button type='submit' variant='contained'>Edit</Button>
          </form>

          <div style={{display:"flex", gap:"10px"}}>
            <TextField
              id="filled-search"
              label="Search field"
              type="search"
              variant="filled"
              value={search} onChange={(user) => {setsearch(user.target.value) ,searchname(user.target.value)}}
            />
            <select value={selete} onChange={(user) => {setselecte(user.target.value) ,sel(user.target.value)}} style={{padding:"18px " , borderRadius:"5px"}} name="" id="">
              <option value="">All</option>
              <option value="true">On sale</option>
              <option value="false">Out of sale</option>
            </select>
          </div>
        </div>

        <div style={{ display: "flex", gap: "20px", overflow: "auto" }}>
          {
            data.map((user) => {
              return <div style={{ marginTop: "30px" }}>

                <Card sx={{ maxWidth: 345 }}>
                  <CardMedia
                    sx={{ height: 220 }}
                    image={user.img}
                    title="green iguana"
                  />
                  <CardContent>
                    <Typography gutterBottom variant="h5" component="div">
                      {user.name}
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                      {user.about}
                    </Typography>
                  </CardContent>
                  <CardContent sx={{ display: "flex", alignItems: "end", justifyContent: "space-between" }}>
                    <Typography gutterBottom variant="h5" component="div">
                      {user.price}
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                      {user.status ? "On slae" : "Out of sale"}
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <Button onClick={() => deleteuser(user.id)} startIcon={<Delete />} color='error' variant='contained' size="small">Delete</Button>
                    <Button onClick={() => showEdit(user)} startIcon={<EditIcon />} variant='contained' size="small">Edit</Button>
                    <div>
                      <Switch onClick={() => changestatus(user)} {...label} defaultChecked checked={user.status} />
                    </div>
                  </CardActions>
                </Card>
              </div>
            })
          }
        </div>
      </section>
    </>
  )
}

export default App
