var app = new Vue({
  el: "#app",
  data: {
    wishlists: [],
    newName: "",
    newLink: "",
    newList: "",
  },
  methods: {
    async getWishlists() {
      try {
        let response = await axios.get("/api/wishlist");
        let lists = response.data;
        for(let i=0;i<lists.length;i++){
          if(this.wishlists.length <= i){
            this.wishlists.push({list: lists[i], show: false});
          }
          else{
            this.wishlists[i].show = this.wishlists[i].show && (this.wishlists[i].list === lists[i]);
            this.wishlists[i].list = lists[i];
          }
        }
        while(this.wishlists.length > lists.length){
          wishlists.pop();
        }
        return true;
      } catch (error) {
        console.log(error);
      }
    },
    async addItem(wishlist){
      try{
        let res = await axios.put('/api/wishlist/'+wishlist.list._id,{
          name: this.newName,
          link: this.newLink,
        });
        this.newName='';
        this.newLink='';
        this.getWishlists();
        return true;
      }catch(error){
        console.log(error);
      }
    },
    async deleteItem(wishlist,item){
      try{
        let res = await axios.delete('/api/wishlist/'+wishlist.list._id+'/'+item.name);
        this.getWishlists();
        return true;
      }catch(error){
        console.log(error);
      }
    },
    async addList(){
      try{
        let res = await axios.post('/api/wishlist/',{
          name: this.newList,  
        });
        this.newList = '';
        this.getWishlists();
      } catch(error){
        console.log(error);
      }
    },
    async deleteList(wishlist){
      try{
        this.wishlists = this.wishlists.filter(function(list){
          return list != wishlist;
        })
        let res = await axios.delete('/api/wishlist/'+wishlist.list._id);
        return true;
      } catch(error){
        console.log(error);
      }
    },
    beforeEnter: function(el){
      el.style.height = 0;
      el.style.opacity = 0;
    },
    enter: function(el, done){
      var delay = el.dataset.index * 1000;
      setTimeout(function(){
        Velocity(
          el,
          {opacity: 1,height: 1},
          {complete: done}
        )
      }, delay);
    },
    leave: function(el, done){
      var delay = el.dataset.index * 1000;
      setTimeout(function(){
        Velocity(
          el,
          {opacity: 0,height: 0},
          {complete: done}
        )
      },delay);
    }
  },
  created(){
    this.getWishlists();
  },
});
