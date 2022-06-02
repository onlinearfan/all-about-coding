import React, { useState, useEffect } from 'react';

const App = () => {
   const [users, setUsers] = useState([]);

   //Fetch Data / Get Data and set in States
   //get data by userEffect
   //you can use useQuery for any data fetch with refetch + many more functions for use,
   useEffect(() => {
      fetch(`www.localhost:5000/users`) //api link : www.localhost:500/users
         .then((res) => {
            return res.json();
         })
         .then((data) => {
            console.log(data); //see data fetching successful
            setUser(data);
         });
   }, [user]); //set dependency for update if user change anythings but if useQuery then it will auto fetch,

   //! Post data by submitting form :
   const onSumbit = (e) => {
      //get input data by React Hook or useRef or State or name on input,
      //check input value empty if custom it, use useQuery,react Form Hook, required auth for fetch form doctorsPortal projects,
      //you can add loading before fetch and after fetch it can be false,
      // setLoading(true)
      e.preventDefault();
      const name = e.target.name.value;
      const email = e.target.email.value;

      const user = {name, email};

      const users = {
         name: 'arfan khan', //input name value will be here,
         phone: 23423, //input phone
      };
      //post fetch
      fetch('/users', {
         method: 'POST',
         header: {
            'content-type': 'application/json',
         },
         body: JSON.stringify({ name: 'arfan khan', email: 'khan189993@gmail.com' }),
      })
         .then((res) => {
            return res.json();
         })
         .then((data) => {
            console.log(data);
            // setLoading(false)
            setUser(data);
            // alert('users added successfully!!!'); //hot toast
            e.target.reset();
            // refetch(); for useQuery auto update, use Context api for give as props when getting data,
         });
   };

   const searchByuserName = (name) => {
      useEffect(() => {
         fetch(`www.localhost:5000/users?name=${name}`) //api link : www.localhost:500/users?name=arfan
            .then((res) => {
               return res.json();
            })
            .then((data) => {
               console.log(data); //see data fetching successful
               setUser(data);
            });
      }, [user]);
   };

   const deleteUpdateData = (id) => {
      //!delete fetch
      fetch(`www.localhost:5000/user/${id}`, {
         method: 'DELETE',
      })
         .then((res) => {
            return res.json();
         })
         .then((data) => {
            console.log(data);
            setData(data);
            // refetch(); loading()  alert() can be used,
         });

      //!put/updata data

      fetch(`www.localhost:5000/user/${id}`, {
         method: 'PUT',
         header: {
            'content-type': 'application/json',
         },
         //data will be update only what are giver others data will be remain same if not change
         body: JSON.stringify({ name: 'arfan khan', email: 'a.k1893@gmail.com' }),
      })
         .then((res) => {
            return res.json();
         })
         .then((data) => {
            console.log(data);
            setUser(data);
         });
   };

   return (
      <>
         <h1>React Crud Functions</h1>
         {
            users.map((user, index) => (
               <User user={user} key={user._id} />
            )) //dont use array key as a key
         }
      </>
   );
};

export default App;

/* 
* for data fetching - useQuery form doctors portal, react hook form 
*for custom input form validation to singup and login - kachari project or mir hossein blog project code,
*use Required Auth form = doctors portal,min hosseing project[blog], 
*use context api form react practice new one, 
*useScroll to top, scroll line effect, tab,infinite scroll, pagination[ph project,programming with prem,],
*use React Icons, see all example of react router on react practice,
*useToast from kachary projects, and blog project of mir, 
*use imgBB,payment,admin route check,dashboard show base on user on doctors portal,
*

*/

//!2nd way code . fully understand 
//Updata user : 
const UpdateUser = () => {
    const {id} = useParams();
    const [user, setUser] = useState({});
    useEffect( () =>{
        const url = `http://localhost:5000/user/${id}`;
        fetch(url)
        .then(res => res.json())
        .then(data => setUser(data));
    }, []);

    const handleUpdateUser = event =>{
        event.preventDefault();
        const name = event.target.name.value;
        const email = event.target.email.value;

        const updatedUser = {name, email};

        // send data to the server
        const url = `http://localhost:5000/user/${id}`;
        fetch(url, {
            method: 'PUT',
            headers: {
                'content-type': 'application/json'
            },
            body: JSON.stringify(updatedUser)
        })
        .then(res => res.json())
        .then(data =>{
            console.log('success', data);
            alert('users added successfully!!!');
            event.target.reset();
        })
    }

    return (
        <div>
            <h2>Updating User: {user.name}</h2>
            <form onSubmit={handleUpdateUser}>
                <input type="text" name="name" placeholder='Name' required />
                <br />
                <input type="email" name="email" placeholder='Email' required />
                <br />
                <input type="submit" value="Update User" />
            </form>
        </div>
    );
};


//get and delete users 
const Home = () => {
    const [users, setUsers] = useState([]);
    useEffect( () =>{
        fetch('http://localhost:5000/user')
        .then(res => res.json())
        .then(data => setUsers(data));
    }, []);

    const handleUserDelete = id =>{
        const proceed = window.confirm('Are you sure you want to delete?');
        if(proceed){
            console.log('deleting user with id, ', id);
            const url = `http://localhost:5000/user/${id}`;
            fetch(url, {
                method: 'DELETE'
            })
            .then(res => res.json())
            .then(data =>{
                if(data.deletedCount > 0){
                    console.log('deleted');
                    const remaining = users.filter(user => user._id !== id);
                    setUsers(remaining);
                }
            })
        }
    }
    return (
        <div>
            <h2>Available Users: {users.length}</h2>
            <ul>
                {
                    users.map(user => <li
                    key={user._id}
                    >{user.name}:: {user.email}
                    <Link to={`/update/${user._id}`}><button>Update</button></Link>
                    <button onClick={() => handleUserDelete(user._id)}>X</button>
                    </li>)
                }
            </ul>
        </div>
    );
};