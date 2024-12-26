local function extract_keys(file_path)
    local keys = {}
    for line in io.lines(file_path) do
        local key = line:match("^(.-)%s*=")
        if key then
            keys[key] = line
        end
    end
    return keys
end

local function compare_files(en_file, ru_file, output_file)
    local en_keys = extract_keys(en_file)
    local ru_keys = extract_keys(ru_file)

    local missing_keys = {}
    for key, line in pairs(en_keys) do
        if not ru_keys[key] then
            table.insert(missing_keys, line)
        end
    end

    local file = io.open(output_file, "w")
    for _, line in ipairs(missing_keys) do
        file:write(line .. "\n")
    end
    file:close()
end

local en_file_path = "C:/Users/araqe/Zomboid/Workshop/PZ_SHTR42/translate_from.txt"
local ru_file_path = "C:/Users/araqe/Zomboid/Workshop/PZ_SHTR42/translate_to.txt"
local output_file_path = "C:/Users/araqe/Zomboid/Workshop/PZ_SHTR42/translate_missing_keys.txt"

compare_files(en_file_path, ru_file_path, output_file_path)