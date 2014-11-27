var util = require('./util');
var typeMap = util.nodeType;

var NodeType = {
    ELEMENT_NODE: 1,
    ATTRIBUTE_NODE: 2,
    TEXT_NODE: 3,
    CDATA_SECTION_NODE: 4,
    ENTITY_REFERENCE_NODE: 5,
    ENTITY_NODE: 6,
    PROCESSING_INSTRUCTION_NODE: 7,
    COMMENT_NODE: 8,
    DOCUMENT_NODE: 9,
    DOCUMENT_TYPE_NODE: 10,
    DOCUMENT_FRAGMENT_NODE: 11
};

// http://www.w3.org/TR/dom/#interface-node
function Node() {
    this.constructor = Node;
    /* eslint-disable no-proto */
    this.__proto__ = Node.prototype;
    /* eslint-enable no-proto */
}

Node.init = function (node, root) {
    // empty node
    if (!node) {
        return new Node();
    }

    // avoid repetitive construct
    if (node instanceof Node) {
        return node;
    }

    Node.apply(node);

    Node.extend(node, root);

    if (node.name === 'document') {
        return Node.createDocument(node);
    }

    if (util.isElement(node)) {
        return Node.createElement(node);
    }

    switch (node.type) {

        case typeMap.Text:
            return Node.createTextNode(node);

        case typeMap.Directive:
            return Node.createDirective(node);

        case typeMap.Comment:
            return Node.createComment(node);

        case typeMap.CDATA:
            return Node.createCDATA(node);

        default:
            return node;

    }
};

Node.extend = function (node, root) {
    var childNodes = node.children || [];

    return util.extend(node, {
        nodeType: '',                                   // fill later depending on node type
        nodeName: '',                                   // fill later depending on node type

        baseURI: '',                                    // TODO
        ownerDocument: root,
        parentNode: node.parent || null,
        parentElement: (node.parent && util.isElement(node.parent)) ? node.parent : null,

        childNodes: childNodes,
        firstChild: childNodes[0] || null,
        lastChild: childNodes[childNodes.length - 1] || null,
        previousSibling: node.prev || null,
        nextSibling: node.next || null,

        nodeValue: null,                                // fill later depending on node type
        textContent: ''                                 // fill later depending on node type
    });
};

// only read ops
util.extend(Node.prototype, {
    hasChildNodes: function () {
        return !!this.childNodes.length;
    },
    isEqualNode: function () { /*TODO*/ },
    compareDocumentPosition: function () { /*TODO*/ },
    contains: function (another) {
        while (another) {
            if (another === this) {
                return true;
            }
            another = another.parentNode;
        }
        return false;
    },
    lookupPrefix: function () { /*TODO*/ },
    lookupNamespaceURI: function () { /*TODO*/ },
    isDefaultNamespace: function () { /*TODO*/ }
});

Node.createElement = function (node) {
    return require('./element').init(util.extend(node, {
        nodeType: NodeType.ELEMENT_NODE,
        nodeName: node.name.toUpperCase(),
        nodeValue: null,
        textContent: node.data
    }));
};

Node.createTextNode = function (node) {
    return util.extend(node, {
        nodeName: '#text',
        nodeType: NodeType.TEXT_NODE,
        nodeValue: node.data,
        textContent: node.data
    });
};

Node.createDirective = function (node) {
    switch (node.name) {

        case '!doctype':
            node.name = node.data.split(' ')[1];
            var attributes = node.attribs || {};

            return util.extend(node, {
                nodeType: NodeType.DOCUMENT_TYPE_NODE,
                nodeName: node.name,
                nodeValue: null,
                textContent: null,

                publicId: attributes.publicId || '',
                systemId: attributes.systemId || ''
            });

        default:
            return util.extend(node, {
                nodeValue: null,
                textContent: null
            });
    }

};

Node.createComment = function (node) {
    return util.extend(node, {
        nodeName: '#comment',
        nodeType: NodeType.COMMENT_NODE,
        nodeValue: node.data,
        textContent: node.data
    });
};

Node.createDocument = function (node) {
    node = require('./element').init(node);

    var doctype = node.childNodes.filter(function (childNode) {
        return childNode.name === '!doctype';
    })[0] || null;

    node.childNodes.forEach(function (childNode) {
        childNode.parentNode = node;
    });

    return util.extend(node, {
        nodeName: '#document',
        nodeType: NodeType.DOCUMENT_NODE,
        nodeValue: null,
        textContent: null,

        URL: 'about:blank',
        documentURI: 'about:blank',
        compatMode: 'CSS1Compat',           // TODO
        characterSet: 'utf-8',
        contentType: 'application/xml',
        doctype: doctype,
        documentElement: node.firstElementChild || null,

        head: node.querySelector('head'),
        body: node.querySelector('body')
    });
};

Node.createCDATA = function (node) {
    return util.extend(node, {
        nodeName: '#cdata',
        nodeType: NodeType.CDATA_SECTION_NODE,
        nodeValue: null,
        textContent: null
    });
};

module.exports = Node;