export const normalizeCategoryId = (value) => {
  if (value === null || value === undefined) return null;

  const resolve = (input) => {
    if (typeof input === 'object') {
      return (
        input._id ??
        input.id ??
        input.value ??
        input.slug ??
        input.code ??
        input.$oid ??
        null
      );
    }
    return input;
  };

  const resolved = resolve(value);
  if (resolved === null || resolved === undefined) return null;
  return String(resolved);
};

const sortCategories = (a = {}, b = {}) => {
  const orderA = typeof a.sort_order === 'number' ? a.sort_order : 0;
  const orderB = typeof b.sort_order === 'number' ? b.sort_order : 0;
  if (orderA !== orderB) return orderA - orderB;
  const nameA = (a.name || '').toString();
  const nameB = (b.name || '').toString();
  return nameA.localeCompare(nameB, 'vi', { sensitivity: 'base' });
};

const buildCategoryGraph = (categories) => {
  if (!Array.isArray(categories)) {
    return { nodes: [], roots: [] };
  }

  const nodes = [];
  const idMap = new Map();

  categories.forEach((cat) => {
    const normalizedId = normalizeCategoryId(
      cat?.normalizedId ??
      cat?._id ??
      cat?.id ??
      cat?.value ??
      cat?.slug ??
      cat?.code
    );
    if (!normalizedId) return;

    const normalizedParentId = normalizeCategoryId(
      cat?.normalizedParentId ??
      cat?.parent_id ??
      cat?.parentId ??
      cat?.parent
    );

    const node = {
      ...cat,
      normalizedId,
      normalizedParentId,
      children: []
    };

    nodes.push(node);
    idMap.set(normalizedId, node);
  });

  nodes.forEach((node) => {
    const parentId = node.normalizedParentId;
    if (parentId && idMap.has(parentId) && parentId !== node.normalizedId) {
      idMap.get(parentId).children.push(node);
    }
  });

  const roots = nodes.filter((node) => {
    if (!node.normalizedParentId) return true;
    if (!idMap.has(node.normalizedParentId)) return true;
    return node.normalizedParentId === node.normalizedId;
  });

  const sortTree = (list) => {
    list.sort(sortCategories);
    list.forEach((child) => sortTree(child.children));
  };

  sortTree(roots);

  return { nodes, roots };
};

export const formatCategoriesWithHierarchy = (categories) => {
  const { nodes, roots } = buildCategoryGraph(categories);

  if (!nodes.length) return [];

  const result = [];
  const visited = new Set();
  const traverse = (node, depth = 0, parentChain = '') => {
    if (!node || visited.has(node.normalizedId)) return;
    visited.add(node.normalizedId);
    const name = node.name || 'Danh mục';
    const displayLabel = parentChain ? `${parentChain} › ${name}` : name;
    const indentedLabel = depth === 0 ? name : `${'--'.repeat(depth)} ${name}`;
    const { children, ...rest } = node;
    result.push({
      ...rest,
      displayLabel,
      parentChainLabel: parentChain,
      depth,
      indentedLabel,
    });
    children.forEach((child) => traverse(child, depth + 1, displayLabel));
  };

  roots.forEach((root) => traverse(root, 0, ''));

  nodes.forEach((node) => {
    if (!visited.has(node.normalizedId)) {
      traverse(node, 0, '');
    }
  });

  return result;
};

export const buildCategoryTree = (categories) => {
  const { roots } = buildCategoryGraph(categories);
  if (!roots.length) return [];

  const cloneWithMeta = (node, depth = 0, chain = []) => {
    if (!node) return null;
    const name = node.name || node.title || 'Danh mục';
    const parentNames = chain.map((item) => item.name || item.title).filter(Boolean);
    const displayLabel = parentNames.length ? `${parentNames.join(' › ')} › ${name}` : name;
    const indentedLabel = depth === 0 ? name : `${'--'.repeat(depth)} ${name}`;
    const clonedChildren = (node.children || [])
      .map((child) => cloneWithMeta(child, depth + 1, [...chain, { name, id: node.normalizedId }]))
      .filter(Boolean);

    return {
      ...node,
      id: node.normalizedId,
      depth,
      displayLabel,
      indentedLabel,
      parentChainLabel: parentNames.join(' › '),
      breadcrumb: [...chain.map((item) => ({ id: item.id, name: item.name })), { id: node.normalizedId, name }],
      children: clonedChildren,
    };
  };

  return roots
    .map((root) => cloneWithMeta(root, 0, []))
    .filter(Boolean);
};
