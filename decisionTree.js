/**
 * Simple decision tree parser and traversal.
 * @param data - object {
 *     initial: [], (list of choice IDs for the root node)
 *     choices: {}  (keyed object of all possible choices)
 * }
**/
var DecisionTree = function(data) {
  
    this.initial = data.initial;
    this.choices = data.choices;
    
    /* Return an array of choice objects for the root of the tree */
    this.getInitial = function() {
      
      if (!this.initial) throw 'DecisionTree: no initial choice(s) specified';
      return this.getChoices(this.initial);
      
    };
    
    /* Get full choice data by specific id */
    this.getChoice = function(id) {
  
      if (!(id in this.choices)) return false;
      if (!('id' in this.choices[id])) this.choices[id].id = id;
      return this.choices[id];
      
    };
    
    /* As above, but passing an array of choice IDs */
    this.getChoices = function(idList) {
      if(!idList) return [];
      var list = [];
      for(var i = 0, ln = idList.length; i < ln; i++) {
        var childChoice = this.getChoice(idList[i]);
        list.push(childChoice);
      }
      return list;
      
    };
    
    /* Get an array of choice data for a parent id */
    this.getChildren = function(parentId) {
      
      if (!(parentId in this.choices)) return false;
      if (!('children' in this.choices[parentId])) return false;
      
      var childIds = this.choices[parentId].children;
      return this.getChoices(childIds);
      
    };
    
    /* Get an array of choice data for the parent(s) of an id */
    this.getParents = function(id) {
      
      var parents = [];
      var node = this.getChoice(id);
      
      while(node.parent) {
        node = this.getChoice(node.parent);
        parents.unshift(node);
      }
      
      return parents;
      
    };
    
    /* Get just an array of ids for the parents of a specific id */
    this.getParentIds = function(id) {
      var parents = this.getParents(id);
      var parentIds = [];
      for(var i = 0, ln = parents.length; i < ln; i++) {
        parentIds.push(parents[i].id);
      }
      return parentIds;
    };
    
    /* Get the 'name' prop for the parent of an id */
    this.getParentName = function(id) {
      var parent = this.getParents(id).pop();
      if(!parent) {
        return false;
      } else {
        return parent.name;
      }
    };
    
    /* Init - insert ids into choice objects, check dups, associate parents, etc */
    this.init = function() {
      
      var idList = [];
      for(var k in this.choices) {
        if(idList.indexOf(k) !== -1) throw 'DecisionTree: duplicate ID "' + k + '" in choice set';
        
        var choice = this.getChoice(k);
        choice.id = k;
        
        var children = this.getChildren(k);
        for(var i = 0; i < children.length; i++) {
          
          var child = children[i];
          if(child.parent) throw 'DecisionTree: tried to assign parent "' + k + '" to child "' + choice.children[i] + '" which already has parent "' + child.parent + '"';
          child.parent = k;
         
        }
        
      }
      
      console.log('init', this.initial, this.choices);
      
    };
    
    this.init();
    
  };
  
  
  /*** TEST DATA ***/
  
  var data = {
    initial: ['1', '2'],
    choices: {
      
      // TOP LEVEL
      
      '1': {
        name: '1 - Caminho 1',
        children: ['3']
      },
      
      '2': {
        name: '2 - Caminho 2',
        children: ['4']
      },
      // CAMINHO 1
      '3': {
        name: 'Parabéns vc chegou ao caminho 1'
      },
      //CAMINHO 2
      '4': {
        name: 'Parabéns vc chegou ao caminho 2'
      },
    
      
    }
  };
  
  /** TEST CODE **/
  

let tree = new DecisionTree(data);
module.exports = {tree}
   