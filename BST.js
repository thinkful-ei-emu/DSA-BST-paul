class BinarySearchTree {
  constructor(key = null, value = null, parent = null) {
    this.key = key;
    this.value = value;
    this.parent = parent;
    this.left = null;
    this.right = null;
  }
  insert(key, value) {
    // If the tree is empty then this key being inserted is the root node of the tree
    if (this.key == null) {
      this.key = key;
      this.value = value;
    }

    /* If the tree already exists, then start at the root, 
       and compare it to the key you want to insert.
       If the new key is less than the node's key 
       then the new node needs to live in the left-hand branch */
    else if (key < this.key) {
      /* If the existing node does not have a left child, 
           meaning that if the `left` pointer is empty, 
           then we can just instantiate and insert the new node 
           as the left child of that node, passing `this` as the parent */
      if (this.left == null) {
        this.left = new BinarySearchTree(key, value, this);
      }
      /* If the node has an existing left child, 
           then we recursively call the `insert` method 
           so the node is added further down the tree */
      else {
        this.left.insert(key, value);
      }
    }
    // Similarly, if the new key is greater than the node's key 
    // then you do the same thing, but on the right-hand side
    else {
      if (this.right == null) {
        this.right = new BinarySearchTree(key, value, this);
      }
      else {
        this.right.insert(key, value);
      }
    }
  }

  find(key) {
    // If the item is found at the root then return that value
    if (this.key == key) {
      return this.value;
    }
    /* If the item you are looking for is less than the root 
       then follow the left child.
       If there is an existing left child, 
       then recursively check its left and/or right child
       until you find the item */
    else if (key < this.key && this.left) {
      return this.left.find(key);
    }
    /* If the item you are looking for is greater than the root 
       then follow the right child.
       If there is an existing right child, 
       then recursively check its left and/or right child
       until you find the item */
    else if (key > this.key && this.right) {
      return this.right.find(key);
    }
    // You have searched the tree and the item is not in the tree
    else {
      throw new Error('Key Error');
    }
  }

  remove(key) {
    if (this.key == key) {
      if (this.left && this.right) {
        const successor = this.right._findMin();
        this.key = successor.key;
        this.value = successor.value;
        successor.remove(successor.key);
      }
      /* If the node only has a left child, 
           then you replace the node with its left child */
      else if (this.left) {
        this._replaceWith(this.left);
      }
      /* And similarly if the node only has a right child 
           then you replace it with its right child */
      else if (this.right) {
        this._replaceWith(this.right);
      }
      /* If the node has no children then
           simply remove it and any references to it 
           by calling "this._replaceWith(null)" */
      else {
        this._replaceWith(null);
      }
    }
    else if (key < this.key && this.left) {
      this.left.remove(key);
    }
    else if (key > this.key && this.right) {
      this.right.remove(key);
    }
    else {
      throw new Error('Key Error');
    }
  }

  _replaceWith(node) {
    if (this.parent) {
      if (this == this.parent.left) {
        this.parent.left = node;
      }
      else if (this == this.parent.right) {
        this.parent.right = node;
      }

      if (node) {
        node.parent = this.parent;
      }
    }
    else {
      if (node) {
        this.key = node.key;
        this.value = node.value;
        this.left = node.left;
        this.right = node.right;
      }
      else {
        this.key = null;
        this.value = null;
        this.left = null;
        this.right = null;
      }
    }
  }

  _findMin() {
    if (!this.left) {
      return this;
    }
    return this.left._findMin();
  }

}

function displayLevels(root){
  let currLevel=(root===null)?[]:[root];
  const allLevels=[];
  while(currLevel.length!==0){
    const nextCurrLevel=[];
    const currLevelData=[];
    currLevel.forEach(node=>{
      if(node.left!==null)
        nextCurrLevel.push(node.left);
      if(node.right!==null)
        nextCurrLevel.push(node.right);
      currLevelData.push(`${node.key}:${node.value}`);
    });
    currLevel=nextCurrLevel;
    allLevels.push(currLevelData);
  }
  allLevels.forEach(level=>console.log(level));
}

//Root is left most, and you travel down the tree by going right
function display(root){
  displayR(root,0);
}

function displayR(node,jump){
  if(node===null)
    return;
  displayR(node.right,jump+1);
  let spaces=[];
  let keyVal=`${node.key}:${node.value}`;
  for(let i=0;i<(jump*6);i++){
    spaces.push(' ');
  }
  if(node.parent!==null)
    if(node.parent.left===node){
      spaces.pop();
      console.log(spaces.join('') + '\\' );
      spaces.push(' ');
    }
  if(node.parent===null)
    console.log('ROOT ' + keyVal );
  else
    console.log(spaces.join('') + keyVal );
  if(node.parent!==null){
    if(node.parent.right===node){
      spaces.pop();
      console.log(spaces.join('') + '/' );
      spaces.push(' ');
    }
    else{
      console.log('');
    }
  } 
  else
    console.log('');
  displayR(node.left,jump+1);

}

function findHeight(rootNode){
  return findHeightR(rootNode,0);
}

function findHeightR(node,height){
  if(node===null)
    return height;
  return Math.max( findHeightR(node.left,height+1) , findHeightR(node.right,height+1) );
}

function isBST(rootNode){
  if(isBSTr(rootNode))
    return true;
  return false;
}

function isBSTr(node){
  if(node===null)
    return true;
  let lT=isBSTr(node.left);
  let rT=isBSTr(node.right);
  if(!lT || !rT)
    return false;
  if(rT===true && lT===true)
    return {
      max:node.key,
      min:node.key
    };
  else if(rT===true){
    if(!(lT.max<node.key))
      return false;
    return {
      min:lT.min,
      max:node.key
    };
  }
  else if(lT===true){
    if(!(rT.min>node.key))
      return false;
    return {
      min:node.key,
      max:rT.max
    };
  }
  else{
    if(!(lT.max<node.key &&node.key<rT.min))
      return false;
    return{
      min:lT.min,
      max:rT.max
    };

  }
}

function thirdLargest(rootNode){
  let successTracker=[0];
  return thirdLargestR(rootNode,successTracker);
}
function thirdLargestR(node,success){
  if(node===null)
    return;
  let right=thirdLargestR(node.right,success);
  if(right)
    return right;
  if(success.length===3)
    return node;
  success.push(0);
  /* console.log(success); */
  let left=thirdLargestR(node.left,success);
  if(left)
    return left;
}

function balancedBST(root){
  let rootHeights={};
  if(root===null)
    return true;
  balancedBSTr(root,1,rootHeights);
  let heights=Object.keys(rootHeights);
  if(heights.length>2)
    return false;
  if(heights.length===1)
    return true;
  if(Math.abs(heights[0]-heights[1]) <=1){
    return true;
  }
}

function balancedBSTr(node,height,recordRootHeights){
  if(node===null)
    return;
  if(node.left===null && node.right===null){
    recordRootHeights[height]=true;
    return;
  }
  balancedBSTr(node.left,height+1,recordRootHeights);
  balancedBSTr(node.right,height+1,recordRootHeights);
}

function sameBST(arr1,arr2){
  console.log(sameBSTr(arr1,arr2));
}

function sameBSTr(arr1,arr2){
  if(arr1.length!==arr2.length)
    return false;
  if(arr1.length===0 && arr2.length===0){
    return true;
  }
  if(arr1[0]!==arr2[0])
    return false;
  let allBigger1=[];
  let allSmaller1=[];
  let allBigger2=[];
  let allSmaller2=[];
  for(let i=1;i<arr1.length;i++){
    if(arr1[i]>=arr1[0])
      allBigger1.push(arr1[i]);
    else
      allSmaller1.push(arr1[i]);
    if(arr2[i]>=arr2[0])
      allBigger2.push(arr2[i]);
    else
      allSmaller2.push(arr2[i]);
  }
  let rightRes=sameBSTr(allBigger1,allBigger2);
  if(!rightRes)
    return false;
  let leftRes=sameBSTr(allSmaller1,allSmaller2);
  if(!leftRes)
    return false;
  return true;
}

function arrayToBST(arr){
  let root= new BinarySearchTree();
  arr2BSTr(arr,0,arr.length-1,root);
  display(root);
  return root;
}

function arr2BSTr(arr,start,end,node){
  if(start>end)
    return;
  const middle=Math.floor((start+end)/2);
  node.key=arr[middle];
  node.value=arr[middle];

  //only time we don't go into this block is if start===end, so it's a leaf node.
  if(start<end){
    let rightNode=new BinarySearchTree(null,null,node);
    node.right=rightNode;
    let leftNode=new BinarySearchTree(null,null,node);
    node.left=leftNode;
    arr2BSTr(arr,start,middle-1,leftNode);
    arr2BSTr(arr,middle+1,end,rightNode);
  }
}

function main(){
  const rootNode=new BinarySearchTree();
  rootNode.insert(3,3);
  rootNode.insert(1,1);
  rootNode.insert(4,4);
  rootNode.insert(6,6);
  rootNode.insert(9,9);
  rootNode.insert(2,2);
  rootNode.insert(5,5);
  rootNode.insert(7,7);

  //next step, add spacing to this.
  displayLevels(rootNode);
  

  //Time complexity likely O(N)
  console.log(findHeight(rootNode));

  let notBST=new BinarySearchTree(3,3,null);
  notBST.left=new BinarySearchTree(4,4,notBST);
  notBST.right=new BinarySearchTree(5,5,notBST);
  console.log(isBST(notBST));
  let notBST2=new BinarySearchTree(3,3,null);
  notBST2.left=new BinarySearchTree(2,2,notBST2);
  notBST2.right=new BinarySearchTree(2.5,2.5,notBST2);
  console.log(isBST(notBST2));
  console.log(isBST(rootNode));
  console.log(thirdLargest(rootNode).key);
  let rootNode2=new BinarySearchTree();
  rootNode2.insert(3,3);
  rootNode2.insert(2,2);
  rootNode2.insert(4,4);
  console.log(thirdLargest(rootNode2).key);
  rootNode2=new BinarySearchTree();
  rootNode2.insert(6,6);
  rootNode2.insert(5,5);
  rootNode2.insert(4,4);
  rootNode2.insert(3,3);
  rootNode2.insert(4.2,4.2);
  console.log(thirdLargest(rootNode2).key);
  display(rootNode);
  console.log(balancedBST(rootNode));
  rootNode.remove(7);
  display(rootNode);
  console.log(balancedBST(rootNode));
  sameBST([3,5,4,6,1,0,2],[3,1,5,2,4,6,0]);
  sameBST([3,5,4,6,1,0,2],[3,1,5,2,4,6,3]);
  arrayToBST([3,5,7,9,11,13,15]);
}
main();


//it sums up all the values in the entire tree using recursion to traverse the tree.
//O(N), where N is the number of nodes in tree, since we will have that many recursive calls of tree, and the addition inside is assumed to be constant time.
function tree(t){
  if(!t){
    return 0;
  }
  return tree(t.left) + t.value + tree(t.right);
}

