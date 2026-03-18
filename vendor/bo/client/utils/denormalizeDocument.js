export default function denormalize(items, config)
{
    const result = {}
    for (const [key, value] of Object.entries(config.data)) {
        if (!value.groupBy) {
            result[key] = []
        }
    }

    // Dictionary by identifier
    const dictionary = {}
    for (const item of items) dictionary[item.identifier] = item

    // Vectors of cells by parent identifier
    const vectors = {}
    for (const item of items) {
        if (item.parent) {
            for (const parentId of item.parent.split(",")) {
                if (!vectors[parentId]) vectors[parentId] = []
                vectors[parentId].push(item)
            }
        }
    }

    for (const item of items) {
        if (item.parent) {
            item.adjacentCells = {}
            item.parentCells = {}
            for (const parentId of item.parent.split(",")) {
                const parent = dictionary[parentId]

                // Parent cells
                item.parentCells[config.levels[parent.level]] = parent

                // Adjacent cells
                const adjacentVector = vectors[parentId]
                item.adjacentCells[config.levels[parent.level]] = []
                for (const adjacent of adjacentVector) {
                    if (adjacent.level === item.level) {
                        item.adjacentCells[config.levels[parent.level]].push(adjacent)
                    }
                }

                // Child cells
                if (vectors[item.identifier]) item.childCells = vectors[item.identifier]
            }
        }
        const level = config.levels[item.level]
        if (!config.data[level].groupBy) {
            if (item.level === 0) {
                result[level] = item
            } else {
                if (!result[level]) result[level] = []
                result[level].push(item)
            }
        }
    }
    for (const item of items) {
        const level = config.levels[item.level]
        if (config.data[level].groupBy) {
            const group = result[config.data[level].groupBy].find(x => x.identifier == item.parent)
            if (!group[level]) group[level] = []
            group[level].push(item)
        }
    }
    return result
}
