import React from 'react';
import fire, { storage } from './../config/fire.js';
import ItemForm from './ItemForm';

export default class Uploader extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      form: {
        name: '',
        description: '',
        imgFile: ''
      }
    }

    this.itemsPath = `${this.props.user.profile.uid}/items`;

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.setImgFile = this.setImgFile.bind(this);
  }

  setImgFile(image) {
    this.setState({
      form: {
        ...this.state.form,
        imgFile: image
      }
    });
  }

  handleChange(e) {
    e.preventDefault();
    this.setState({
      form: {
        ...this.state.form,
        [e.target.name]: e.target.value
      }
    });
  }

  handleSubmit(e) {
    this.props.setLoading(true);
    e.preventDefault();
    const storageRef = storage.ref();
    const userId = this.props.user.profile.uid;
    const newKey = fire.database().ref(this.itemsPath).push().key; // generate unique key

    this.uploadImage(this.state.form.imgFile, newKey).then(() => {   // upload image
      storageRef.child(`${userId}/${newKey}.jpg`).getDownloadURL().then((url) => { // get image url
        this.addItem(url);  // add to db
      });
    });  
  }

  uploadImage(file, filename) {
    const storageRef = storage.ref();
    const userId = this.props.user.profile.uid;
    const imageRef = storageRef.child(`${userId}/${filename}.jpg`);

    return imageRef.put(file);
  }

  addItem(imgUrl){
    const { form: { name, description } } = this.state;

    fire.database().ref(this.itemsPath).push({  // Send the message to Firebase
      name: name,
      description: description,
      imgUrl: imgUrl
    });

    this.setState({
      form: {
        name: '',
        description: '',
        imgFile: {}
      }
    });
  }

  render() {
    const { form } = this.state;

    return <ItemForm
      formData={ form }
      showDropzone={ true }
      handleChange={this.handleChange}
      handleSubmit={this.handleSubmit}
      setImgFile={this.setImgFile}
      buttonText={'Upload'}
    />
  }
}