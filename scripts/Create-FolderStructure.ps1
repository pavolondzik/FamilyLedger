# Create folders inside project under certain base path
function New-DirectoryStructure {
    param (
        [Parameter(Mandatory=$true)]
        [string]$BasePath,

        [Parameter(Mandatory=$true)]
        [string[]]$Folders
    )

    foreach ($folder in $Folders) {
        # Combine the base path and folder name into a single path
        $fullPath = Join-Path -Path $BasePath -ChildPath $folder
        
        # Force creates the path (similar to mkdir -p)
        New-Item -Path $fullPath -ItemType Directory -Force | Out-Null
    }
    
    Write-Host "Successfully created directories in: $BasePath" -ForegroundColor Cyan
}

# Create DLL project
function New-ClassLib {
    param (
        [Parameter(Mandatory=$true)]
        [string]$Project,

        [Parameter(Mandatory=$true)]
        [string]$Layer,

        [Parameter(Mandatory=$true)]
        [string]$Path
    )

    # 1. Setup paths and naming conventions
    $targetDir = Join-Path -Path $Path -ChildPath "src/core"
    $projectName = "$Project.$Layer"
    $projectPath = Join-Path -Path $targetDir -ChildPath $projectName

    # 2. Ensure the parent directory (src/core) exists
    if (-not (Test-Path -Path $targetDir)) {
        Write-Host "Creating missing directory: $targetDir" -ForegroundColor Yellow
        New-Item -Path $targetDir -ItemType Directory -Force | Out-Null
    }

    # 3. Create the dotnet project
    if (-not (Test-Path -Path $projectPath)) {
        Write-Host "Creating $Layer layer at: $projectPath" -ForegroundColor Cyan
        dotnet new classlib -n $projectName -o $projectPath
    } else {
        Write-Warning "Project $projectName already exists at this location."
    }
}

##############################################################################################################################################################
# Create projects
$projectName = "FamilyLedger"

New-ClassLib -Project $projectName -Layer "Domain" -Path "./src/core"
New-ClassLib -Project $projectName -Layer "Application" -Path "./src/core"
New-ClassLib -Project $projectName -Layer "Infrastructure" -Path "./src/infrastructure"

dotnet new webapi -n "$projectName.Api" -o "./src/presentation/$projectName.Api" --use-controllers

# Create subfolders
New-DirectoryStructure -BasePath "./src/core/$projectName.Domain/" -Folders "DomainServices", "Entities", "Enums", "Exceptions", "Interfaces", "ValueObjects"
New-DirectoryStructure -BasePath "./src/core/$projectName.Application/" -Folders "DTOs", "Extensions", "Interfaces", "Mappings", "UseCases"
New-DirectoryStructure -BasePath "./src/infrastructure/$projectName.Infrastructure/" -Folders "Extensions", "Persistence", "Interfaces"
New-DirectoryStructure -BasePath "./src/presentation/$projectName.Api/" -Folders "Middleware", "Extensions"

# Reference projects
# Application depends on Domain
dotnet add "./src/core/$projectName.Application" reference "./src/core/$projectName.Domain"

# Infrastructure depends on Application (and Domain)
dotnet add "./src/infrastructure/$projectName.Infrastructure" reference "./src/core/$projectName.Application"

# WebApi depends on everything to wire up DI
dotnet add "./src/presentation/$projectName.Api" reference "./src/core/$projectName.Application"
dotnet add "./src/presentation/$projectName.Api" reference "./src/infrastructure/$projectName.Infrastructure"